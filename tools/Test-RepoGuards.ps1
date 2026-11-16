<#
Repository guards. Cheap, deterministic rules that must hold on every commit.
Exit code 1 with -Strict when a violation is found. Add new guards here, never in prose only.
#>
param(
    [string]$Root = '.',
    [switch]$Strict
)
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path $Root).Path
$skip = '\\(\.git|bin|obj|node_modules|dist|artifacts|wwwroot\\esm)\\'
$files = Get-ChildItem -LiteralPath $Root -Recurse -File | Where-Object { $_.FullName.Replace('/', '\') -notmatch $skip }
$violations = New-Object System.Collections.Generic.List[string]
# Built from char codes so this file stays pure ASCII (Windows PowerShell 5.1 reads BOM-less files as ANSI).
$mojibakeRx = '[' + [char]0xC3 + [char]0xC4 + [char]0xC5 + ']['+ [char]0x80 + '-' + [char]0xBF + [char]0x152 + '-' + [char]0x192 + [char]0x2013 + '-' + [char]0x203A + ']'
function Add-V($rule, $file, $detail) { $violations.Add(("[{0}] {1} {2}" -f $rule, $file.FullName.Substring($Root.Length).TrimStart('\', '/'), $detail)) }
function Get-LocalizationKeys($value, $prefix = '') {
    foreach ($property in $value.PSObject.Properties) {
        if ($property.Name -eq '__comment__') { continue }
        $key = if ($prefix) { "$prefix.$($property.Name)" } else { $property.Name }
        if ($property.Value -is [System.Management.Automation.PSCustomObject]) {
            Get-LocalizationKeys $property.Value $key
        } elseif ($property.Value -is [string] -and -not [string]::IsNullOrWhiteSpace($property.Value)) {
            $key
        }
    }
}

$cs = $files | Where-Object { $_.Extension -eq '.cs' -and $_.FullName.Replace('/', '\') -notmatch '\\ServerTypes\\' }
foreach ($f in $cs) {
    $t = [IO.File]::ReadAllText($f.FullName)
    if ($t -match '#nullable\s+disable') { Add-V 'nullable' $f '#nullable disable is forbidden' }
    if ($t -match 'GetAwaiter\(\)\s*\.\s*GetResult\(\)|\.Wait\(\)') { Add-V 'async' $f 'sync-over-async (GetResult/Wait)' }
    if ($t -match 'Task\.Run\s*\(' ) { Add-V 'async' $f 'Task.Run (never wrap database I/O)' }
    if ($f.FullName.Replace('/', '\') -notmatch '\\(Migrations|tests)\\' -and
        ($t -split '\r?\n').Count -gt 300) { Add-V 'file-size' $f 'hand-written C# exceeds 300 lines' }
    if ($t -match '(?i)select\s+\*\s+from') { Add-V 'sql' $f 'SELECT * is forbidden' }
    if ($t -match '(?i)\bSELECT\s+TOP\b|\bISNULL\s*\(|\bGETDATE\s*\(\)|scope_identity') { Add-V 'sql' $f 'provider-specific SQL in portable code' }
    if ($f.FullName.Replace('/', '\') -match '\\Migrations\\' -and $t -match '\[Migration\(') {
        if ($t -notmatch '\[Tags\(') { Add-V 'migration' $f 'migration without [Tags(...)]' }
        if ($t -match '\.AsDate\(\)') { Add-V 'migration' $f 'date-only fields use AsDateTime with midnight values' }
        if ($f.Name -notmatch '_\d{8}_\d{4}') { Add-V 'migration' $f 'file name must contain _YYYYMMDD_HHMM' }
        if ($t -match 'WithColumn\("(?!Id")\w+Id"\)[^;\r\n]*PrimaryKey') { Add-V 'migration' $f 'primary key must be named Id' }
        if ($t -match 'Create\.Table\("\w*[^s"]"\)') { Add-V 'migration' $f 'table name should be plural (verify)' }
    }
}

foreach ($f in $files | Where-Object { $_.Extension -in '.csproj', '.props', '.targets' }) {
    $t = [IO.File]::ReadAllText($f.FullName)
    if ($t -match 'ContinueOnError\s*=\s*"true"') { Add-V 'build' $f 'ContinueOnError="true" hides failures' }
    if ($t -match 'TypeScriptNoEmitOnError>\s*false') { Add-V 'build' $f 'TypeScriptNoEmitOnError=false hides failures' }
    if ($f.Extension -eq '.csproj' -and $t -match '<PackageReference[^>]*\sVersion="') { Add-V 'packages' $f 'PackageReference with inline Version (use Directory.Packages.props)' }
}

foreach ($f in $files | Where-Object { $_.Extension -in '.cs', '.ts', '.tsx', '.json', '.cshtml' } ) {
    $t = [IO.File]::ReadAllText($f.FullName)
    if ($t -match $mojibakeRx) { Add-V 'encoding' $f 'mojibake (double-encoded UTF-8)' }
}

foreach ($f in $files | Where-Object { $_.Name -like 'appsettings*.json' }) {
    $t = [IO.File]::ReadAllText($f.FullName)
    if ($t -match '(?i)(password|pwd)\s*=\s*[^;"\s<]+' -and $t -notmatch '(?i)integrated security') { Add-V 'secrets' $f 'credential in committed appsettings (use environment variables or a secret store)' }
    if ($t -match '(?i)"(apikey|secret|clientsecret|token)"\s*:\s*"[^"<]{8,}"') { Add-V 'secrets' $f 'secret value in committed appsettings' }
}
# ---- Module conventions: no Turkish text in code, complete translations, enum standard ----
$turkishRx = '[' + [char]0x011F + [char]0x011E + [char]0x0131 + [char]0x0130 + [char]0x015F + [char]0x015E + ']'
foreach ($f in $files | Where-Object { $_.Extension -in '.cs', '.ts', '.tsx', '.cshtml', '.css' -and $_.FullName.Replace('/', '\') -notmatch '\\(ServerTypes|tests|texts\\resources)\\' -and ($_.FullName.Replace('/', '\') -match '\\(src|host)\\') }) {
    $t = [IO.File]::ReadAllText($f.FullName)
    $noCharLiterals = [regex]::Replace($t, "'(\\.|[^'\\])'", '')   # single-character literals are functional, not prose
    if ($noCharLiterals -cmatch $turkishRx) { Add-V 'turkish-text' $f 'Turkish text in code or comment; code is English, translations go to texts/resources/*.tr.json' }
}

foreach ($tpl in $files | Where-Object { $_.Name -like '*.texts.__.json' -and $_.FullName.Replace('/', '\') -match '\\src\\' }) {
    $dir = $tpl.DirectoryName; $stem = $tpl.Name.Substring(0, $tpl.Name.Length - '__.json'.Length)
    $keys = @()
    try { $keys = @(Get-LocalizationKeys ([IO.File]::ReadAllText($tpl.FullName) | ConvertFrom-Json)) } catch { Add-V 'localization' $tpl 'template file is not valid JSON'; continue }
    foreach ($lang in 'en', 'tr') {
        $p = Join-Path $dir ($stem + $lang + '.json')
        if (-not (Test-Path -LiteralPath $p)) { Add-V 'localization' $tpl "missing $stem$lang.json"; continue }
        $obj = $null
        try { $obj = [IO.File]::ReadAllText($p) | ConvertFrom-Json } catch { Add-V 'localization' $tpl "$stem$lang.json is not valid JSON"; continue }
        $have = @(Get-LocalizationKeys $obj)
        $missing = @($keys | Where-Object { $have -notcontains $_ })
        if ($missing.Count -gt 0) { Add-V 'localization' $tpl ("{0}{1}.json lacks {2} key(s), first: {3}" -f $stem, $lang, $missing.Count, $missing[0]) }
    }
    if (-not (Get-ChildItem -LiteralPath (Split-Path $dir -Parent) -Filter '*Texts.cs' -File -ErrorAction SilentlyContinue)) { Add-V 'localization' $tpl 'texts folder has no *Texts.cs ([NestedLocalTexts] class)' }
}

foreach ($f in $files | Where-Object { $_.Extension -eq '.cs' -and $_.FullName.Replace('/', '\') -match '\\src\\' -and $_.FullName.Replace('/', '\') -notmatch '\\ServerTypes\\' }) {
    $t = [IO.File]::ReadAllText($f.FullName)
    foreach ($m in [regex]::Matches($t, '(?s)(?<attrs>(?:\[[^\]]+\]\s*)*)public\s+enum\s+(?<name>\w+)[^{]*\{(?<body>[^}]*)\}')) {
        $name = $m.Groups['name'].Value
        if ($f.FullName.Replace('/', '\') -notmatch '\\Modules\\Enums\\') { Add-V 'enum' $f "enum $name must live under Modules/Enums" }
        if ($name -notmatch 's$') { Add-V 'enum' $f "enum $name must have a plural name" }
        if ($m.Groups['attrs'].Value -notmatch 'ScriptInclude' -or $m.Groups['attrs'].Value -notmatch 'EnumKey\(') { Add-V 'enum' $f "enum $name needs [ScriptInclude] and [EnumKey(...)]" }
        $members = @($m.Groups['body'].Value -split ',' | Where-Object { $_.Trim().Length -gt 0 })
        $described = @($members | Where-Object { $_ -match '\[Description\(' })
        if ($described.Count -ne $members.Count) { Add-V 'enum' $f "enum ${name}: every member needs [Description(...)]" }
    }
}
# Platform repository must stay free of commercial references.
if (Test-Path (Join-Path $Root 'src')) {
    # Detected by the solution file, not the folder name, so worktrees, forks and a renamed public repository are covered.
    $isPlatform = Test-Path (Join-Path $Root 'Bizeka.Platform.slnx')
    if ($isPlatform) {
        foreach ($f in $files | Where-Object { $_.Extension -in '.csproj', '.cs', '.ts', '.tsx', '.json', '.props', '.targets', '.mjs', '.yml' -and $_.Name -ne 'Test-RepoGuards.ps1' }) {
            $t = [IO.File]::ReadAllText($f.FullName)
            if ($t -match '(?i)Bizeka\.[A-Za-z.]+\.Pro\b|bizeka-commercial|@bizeka/[a-z-]+-pro\b|StartSharp|Serenity\.Pro') {
                Add-V 'platform-boundary' $f 'platform must not reference commercial, SSU or StartSharp'
            }
        }
    }
}

if ($violations.Count -eq 0) { Write-Host 'Repository guards: OK'; exit 0 }
$violations | ForEach-Object { Write-Host $_ }
Write-Host ("Repository guards: {0} violation(s)" -f $violations.Count)
if ($Strict) { exit 1 }

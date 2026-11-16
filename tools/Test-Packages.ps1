<# Create local archives and inspect the files/metadata consumers receive. Never publishes. #>
param([string]$OutputPath = 'artifacts/packages')
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot
$output = [IO.Path]::GetFullPath((Join-Path $repo $OutputPath))
$nuget = Join-Path $output 'nuget'
$npm = Join-Path $output 'npm'
New-Item -ItemType Directory -Force $nuget, $npm | Out-Null
Push-Location $repo
try {
    dotnet pack Bizeka.Platform.slnx -c Release --no-build --no-restore -o $nuget
    if ($LASTEXITCODE -ne 0) { throw 'NuGet packing failed.' }
    foreach ($module in 'Extensions', 'DynamicForms', 'Todo', 'OnlineChat', 'Theme', 'Demo') {
        $directory = Join-Path $repo "src/bizeka.$($module.ToLowerInvariant())"
        $manifest = Get-Content (Join-Path $directory 'package.json') -Raw | ConvertFrom-Json
        $archivePath = Join-Path $nuget "Bizeka.$module.$($manifest.version).nupkg"
        $archive = [IO.Compression.ZipFile]::OpenRead($archivePath)
        try {
            $names = @($archive.Entries | ForEach-Object FullName)
            foreach ($required in 'LICENSE', 'THIRD-PARTY-NOTICES.md', 'README.md', "lib/net10.0/Bizeka.$module.dll") {
                if ($names -notcontains $required) { throw "${module}: missing NuGet file $required" }
            }
            if ($names | Where-Object { $_ -match '^(content|contentFiles)/' }) {
                throw "${module}: developer configuration leaked into consumer content."
            }
            $reader = [IO.StreamReader]::new($archive.GetEntry("Bizeka.$module.nuspec").Open())
            try { [xml]$spec = $reader.ReadToEnd() } finally { $reader.Dispose() }
            $metadata = $spec.package.metadata
            if ($metadata.repository.url -ne 'https://github.com/Bizeka/bizeka-platform') {
                throw "${module}: incorrect repository URL."
            }
            if ($metadata.version -ne $manifest.version) { throw "${module}: npm/NuGet version mismatch." }
            if ($metadata.license.InnerText -ne 'MIT' -or $metadata.license.type -ne 'expression') {
                throw "${module}: archive must declare the MIT license expression."
            }
            if ($module -eq 'Theme' -and $names -notcontains 'staticwebassets/bizeka-theme/bizeka-theme.css') {
                throw 'Theme stylesheet missing from NuGet archive.'
            }
            if ($module -eq 'Theme' -and $names -notcontains 'staticwebassets/bizeka-theme/bizeka-theme-init.js') {
                throw 'Theme init script missing from NuGet archive.'
            }
            # Page bundles are build output (not committed); every one the build produced must ship.
            $esm = Join-Path $directory 'wwwroot/esm'
            if (Test-Path $esm) {
                foreach ($bundle in Get-ChildItem $esm -Recurse -File -Filter *.js) {
                    $entry = 'staticwebassets/esm/' + [IO.Path]::GetRelativePath($esm, $bundle.FullName).Replace('\', '/')
                    if ($names -notcontains $entry) { throw "${module}: page bundle missing from NuGet archive: $entry" }
                }
            }
        }
        finally { $archive.Dispose() }
        Push-Location $directory
        try {
            $json = & npm pack --json --pack-destination $npm
            if ($LASTEXITCODE -ne 0) { throw "${module}: npm packing failed." }
            $package = ($json -join "`n" | ConvertFrom-Json)[0]
            $files = @($package.files | ForEach-Object path)
            foreach ($required in 'package.json', 'LICENSE', 'THIRD-PARTY-NOTICES.md', 'README.md', 'dist/index.js', 'dist/index.d.ts') {
                if ($files -notcontains $required) { throw "${module}: missing npm file $required" }
            }
            foreach ($export in $manifest.exports.PSObject.Properties) {
                $targets = if ($export.Value -is [string]) { @($export.Value) } else { @($export.Value.PSObject.Properties.Value) }
                foreach ($target in $targets) {
                    if ($files -notcontains $target.TrimStart('.', '/')) { throw "${module}: missing export $target" }
                }
            }
            if ($files | Where-Object { $_ -match '(^|/)(node_modules|test|tests)/|^Modules/|\.cs$|\.csproj$|^package-lock\.json$' -or ($_ -match '\.tsx?$' -and $_ -notmatch '\.d\.ts$') }) {
                throw "${module}: development source leaked into npm archive."
            }
            if (-not (Test-Path (Join-Path $npm $package.filename))) { throw "${module}: npm archive was not written." }
            Write-Output "${module}: NuGet and npm archive contents verified."
        }
        finally { Pop-Location }
    }
}
finally { Pop-Location }

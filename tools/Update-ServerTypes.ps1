param([switch]$Check)
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot
function Get-GeneratedHashes {
    Get-ChildItem (Join-Path $repo 'src') -Recurse -File -Filter *.ts |
        Where-Object { $_.FullName.Replace('\', '/') -match '/Modules/ServerTypes/' } |
        Sort-Object FullName | ForEach-Object { "$($_.FullName):$((Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash)" }
}
$before = @(Get-GeneratedHashes)
foreach ($directory in Get-ChildItem (Join-Path $repo 'src') -Directory) {
    $project = Get-ChildItem $directory -Filter *.csproj | Select-Object -First 1
    if (-not (Test-Path (Join-Path $directory "bin/Release/net10.0/$($project.BaseName).dll"))) {
        throw "Build $($project.BaseName) in Release before generating server types."
    }
    Push-Location $directory
    try {
        dotnet sergen servertypings -p $project.Name -prop:Configuration=Release
        if ($LASTEXITCODE -ne 0) { throw "Server type generation failed for $($project.BaseName)." }
    }
    finally { Pop-Location }
}
$after = @(Get-GeneratedHashes)
if ($Check -and (Compare-Object $before $after)) { throw 'Generated server types differ. Regenerate and commit them.' }

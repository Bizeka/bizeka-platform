param([switch]$Check)
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot
foreach ($project in Get-ChildItem (Join-Path $repo 'src') -Recurse -Filter *.csproj) {
    $directory = $project.DirectoryName
    $module = $project.BaseName.Substring('Bizeka.'.Length).ToLowerInvariant()
    $resources = Join-Path $directory 'texts/resources'
    if (-not (Test-Path $resources)) { continue }
    $arguments = @('run', '--project', (Join-Path $PSScriptRoot 'Bizeka.TextTemplates/Bizeka.TextTemplates.csproj'),
        '-c', 'Release', '--no-build', '--', (Join-Path $directory "bin/Release/net10.0/$($project.BaseName).dll"),
        (Join-Path $resources "$module.texts.__.json"))
    if ($Check) { $arguments += '--check' }
    & dotnet @arguments
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

param()
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot
$failures = [Collections.Generic.List[string]]::new()
Push-Location $repo
try {
    $json = & dotnet list Bizeka.Platform.slnx package --vulnerable --include-transitive --format json
    if ($LASTEXITCODE -ne 0) { throw 'NuGet audit could not complete.' }
    $report = $json -join "`n" | ConvertFrom-Json
    foreach ($project in $report.projects) {
        foreach ($framework in $project.frameworks) {
            foreach ($package in @($framework.topLevelPackages) + @($framework.transitivePackages)) {
                if ($package.vulnerabilities) {
                    $failures.Add("NuGet: $($package.id) $($package.resolvedVersion) in $([IO.Path]::GetFileName($project.path))")
                }
            }
        }
    }
    foreach ($directory in Get-ChildItem (Join-Path $repo 'src') -Directory) {
        Push-Location $directory
        try {
            $json = & npm audit --json
            $status = $LASTEXITCODE
            $report = $json -join "`n" | ConvertFrom-Json
            if ($report.error -or -not $report.metadata) { throw "npm audit unavailable: $($directory.Name)" }
            if ($status -notin 0, 1) { throw "npm audit failed: $($directory.Name)" }
            if ($report.metadata.vulnerabilities.total -gt 0) {
                $failures.Add("npm: $($directory.Name) has $($report.metadata.vulnerabilities.total) vulnerable packages.")
            }
        }
        finally { Pop-Location }
    }
    if ($failures.Count) {
        $failures | ForEach-Object { Write-Output $_ }
        throw 'Release dependency audit failed. Existing restore suppressions do not exempt release audits.'
    }
    Write-Output 'NuGet and npm dependency audits passed.'
}
finally { Pop-Location }

<# Frozen frontend installs with NuGet-supplied framework runtime files. #>
param()
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot
Push-Location $repo
try {
    dotnet tool restore
    if ($LASTEXITCODE -ne 0) { throw 'Tool restore failed.' }
    dotnet restore Bizeka.Platform.slnx
    if ($LASTEXITCODE -ne 0) { throw 'Dependency restore failed.' }
    foreach ($module in 'extensions', 'dynamicforms', 'todo', 'onlinechat', 'theme', 'demo') {
        $directory = Join-Path $repo "src/bizeka.$module"
        dotnet msbuild $directory -t:RestoreNodeTypes -p:Configuration=Release
        if ($LASTEXITCODE -ne 0) { throw "Framework restore failed: $module" }
        Push-Location $directory
        try {
            npm ci --ignore-scripts
            if ($LASTEXITCODE -ne 0) { throw "Frozen npm install failed: $module" }
        }
        finally { Pop-Location }
        # npm ci removes node_modules/.dotnet. Rehydrate before build/test.
        dotnet msbuild $directory -t:RestoreNodeTypes -p:Configuration=Release
        if ($LASTEXITCODE -ne 0) { throw "Framework runtime restore failed: $module" }
    }
}
finally { Pop-Location }

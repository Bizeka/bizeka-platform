<# Resolve public JS and declaration exports from the actual local npm tarballs. #>
param([string]$PackagePath = 'artifacts/packages/npm')
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot
$feed = [IO.Path]::GetFullPath((Join-Path $repo $PackagePath))
$directory = Join-Path ([IO.Path]::GetTempPath()) ("bizeka-npm-" + [Guid]::NewGuid().ToString('N'))
$packages = Join-Path $directory 'node_modules/@bizeka'
New-Item -ItemType Directory -Force $packages | Out-Null
foreach ($module in 'extensions', 'dynamicforms', 'todo', 'onlinechat', 'theme', 'demo') {
    $manifest = Get-Content (Join-Path $repo "src/bizeka.$module/package.json") -Raw | ConvertFrom-Json
    $archive = Join-Path $feed "bizeka-$module-$($manifest.version).tgz"
    $unpack = Join-Path $directory "unpack/$module"
    New-Item -ItemType Directory -Force $unpack | Out-Null
    $file = [IO.File]::OpenRead($archive)
    $gzip = [IO.Compression.GZipStream]::new($file, [IO.Compression.CompressionMode]::Decompress)
    try { [System.Formats.Tar.TarFile]::ExtractToDirectory($gzip, $unpack, $false) }
    finally { $gzip.Dispose(); $file.Dispose() }
    Move-Item (Join-Path $unpack 'package') (Join-Path $packages $module)
}
# A Serene host supplies exactly these runtime/types from its pinned NuGet graph.
$framework = Join-Path $directory 'node_modules/@serenity-is'
New-Item -ItemType Directory -Force $framework | Out-Null
foreach ($package in Get-ChildItem (Join-Path $repo 'src/bizeka.demo/node_modules/.dotnet') -Directory) {
    if ($package.Name -like 'serenity.*') {
        $name = $package.Name.Substring('serenity.'.Length)
        Copy-Item $package.FullName (Join-Path $framework $name) -Recurse
    }
}
@'
import * as Extensions from "@bizeka/extensions";
import * as DynamicForms from "@bizeka/dynamicforms";
import * as Todo from "@bizeka/todo";
import * as OnlineChat from "@bizeka/onlinechat";
import * as Theme from "@bizeka/theme";
import * as Demo from "@bizeka/demo";
export { Extensions, DynamicForms, Todo, OnlineChat, Theme, Demo };
export const applyTheme = Theme.applyBizekaTheme;
export const fieldEditor = DynamicForms.DynamicFieldsEditor;
'@ | Set-Content (Join-Path $directory 'consumer.ts') -Encoding utf8
Push-Location $directory
try {
    $tsc = Join-Path $repo 'src/bizeka.extensions/node_modules/typescript/bin/tsc'
    & node $tsc --noEmit --module esnext --moduleResolution bundler --target es2022 --skipLibCheck consumer.ts
    if ($LASTEXITCODE -ne 0) { throw 'Public npm declaration exports did not type-check.' }
    $esbuild = Join-Path $repo 'src/bizeka.extensions/node_modules/esbuild'
    & node -e 'require(process.argv[1]).buildSync({entryPoints:["consumer.ts"],bundle:true,format:"esm",platform:"browser",external:["@serenity-is/*","@microsoft/signalr"],outfile:"consumer.js"})' $esbuild
    if ($LASTEXITCODE -ne 0) { throw 'Public npm JavaScript exports did not bundle.' }
    Write-Output 'npm tarball consumer: all six public declaration and JavaScript entry points resolved.'
}
finally { Pop-Location }

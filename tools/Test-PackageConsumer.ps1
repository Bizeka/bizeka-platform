<# Restore all six local NuGet archives into a fresh host and serve a packaged asset. #>
param([string]$PackagePath = 'artifacts/packages/nuget')
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot
$feed = [IO.Path]::GetFullPath((Join-Path $repo $PackagePath))
$directory = Join-Path ([IO.Path]::GetTempPath()) ("bizeka-consumer-" + [Guid]::NewGuid().ToString('N'))
$packageCache = "$directory-packages"
New-Item -ItemType Directory $directory | Out-Null
$references = foreach ($module in 'extensions', 'dynamicforms', 'todo', 'onlinechat', 'theme', 'demo') {
    $manifest = Get-Content (Join-Path $repo "src/bizeka.$module/package.json") -Raw | ConvertFrom-Json
    $id = @{'extensions'='Extensions';'dynamicforms'='DynamicForms';'todo'='Todo';'onlinechat'='OnlineChat';'theme'='Theme';'demo'='Demo'}[$module]
    "<PackageReference Include=`"Bizeka.$id`" Version=`"$($manifest.version)`" />"
}
@"
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
  <ItemGroup>$($references -join "`n")</ItemGroup>
</Project>
"@ | Set-Content (Join-Path $directory 'Consumer.csproj') -Encoding utf8
# Existing advisory exceptions are explicit here too; the strict release audit
# remains independent and fails until their root dependency is remediated.
$suppressions = Select-Xml -Path (Join-Path $repo 'Directory.Build.props') -XPath '//NuGetAuditSuppress'
$items = $suppressions | ForEach-Object { "<NuGetAuditSuppress Include=`"$($_.Node.Include)`" />" }
"<Project><ItemGroup>$($items -join '')</ItemGroup></Project>" |
    Set-Content (Join-Path $directory 'Directory.Build.props') -Encoding utf8
@'
using Bizeka.Todo;
using Bizeka.Todo.AppServices;
using Bizeka.OnlineChat;
using Bizeka.OnlineChat.AppServices;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddBizekaTodo();
builder.Services.AddBizekaOnlineChat(builder.Configuration);
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    _ = scope.ServiceProvider.GetRequiredService<ITaskItemBllService>();
    _ = scope.ServiceProvider.GetRequiredService<IChatAccessService>();
    foreach (var module in new[] { "Extensions", "DynamicForms", "Todo", "OnlineChat", "Theme", "Demo" })
        _ = Assembly.Load("Bizeka." + module).GetExportedTypes();
}
app.MapStaticAssets();
app.Run();
'@ | Set-Content (Join-Path $directory 'Program.cs') -Encoding utf8
$process = $null
Push-Location $directory
try {
    # Isolate packages so an older local archive at the same prerelease version
    # cannot make this smoke test pass using stale cached Platform assemblies.
    # A nuget.config is portable; repeating --source with a local path and a URL fails on Windows (NU1301).
    @"
<configuration><packageSources><clear /><add key="local" value="$feed" /><add key="nuget.org" value="https://api.nuget.org/v3/index.json" /></packageSources></configuration>
"@ | Set-Content (Join-Path $directory 'nuget.config') -Encoding utf8
    # Use the repository SDK, not whatever newer SDK the machine resolves outside the checkout.
    Copy-Item (Join-Path $repo 'global.json') $directory
    dotnet restore Consumer.csproj --packages $packageCache
    if ($LASTEXITCODE -ne 0) { throw 'Package consumer restore failed.' }
    dotnet build Consumer.csproj -c Release --no-restore
    if ($LASTEXITCODE -ne 0) { throw 'Package consumer build failed.' }
    $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 0)
    $listener.Start()
    $port = $listener.LocalEndpoint.Port
    $listener.Stop()
    $process = Start-Process dotnet -ArgumentList @('run', '--project', 'Consumer.csproj', '-c', 'Release', '--no-build', '--no-restore', '--no-launch-profile', '--', '--environment', 'Development', '--urls', "http://127.0.0.1:$port") -PassThru -NoNewWindow -RedirectStandardOutput (Join-Path $directory 'host.log') -RedirectStandardError (Join-Path $directory 'host-errors.log')
    $response = $null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        if ($process.HasExited) { throw "Consumer host exited; inspect $directory/host-errors.log" }
        try {
            $response = Invoke-WebRequest "http://127.0.0.1:$port/_content/Bizeka.Theme/bizeka-theme/bizeka-theme.css" -TimeoutSec 2
            break
        }
        catch { Start-Sleep -Seconds 1 }
    }
    if (-not $response -or $response.StatusCode -ne 200 -or $response.Content -notmatch 'tokens\.css') {
        throw "Packaged theme stylesheet failed its functional request; logs: $directory"
    }
    $tokens = Invoke-WebRequest "http://127.0.0.1:$port/_content/Bizeka.Theme/bizeka-theme/tokens.css" -TimeoutSec 5
    if ($tokens.StatusCode -ne 200 -or $tokens.Content -notmatch '--bizeka-canvas') {
        throw 'The packaged theme token stylesheet is missing or invalid.'
    }
    Write-Output 'Fresh package consumer: six assemblies loaded, module DI resolved, packaged theme stylesheet served.'
}
finally {
    if ($process -and -not $process.HasExited) { $process.Kill($true); $process.WaitForExit() }
    Pop-Location
}

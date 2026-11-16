param([Parameter(Mandatory)][ValidateSet('Postgres', 'SqlServer', 'MySql')][string]$Provider)
$ErrorActionPreference = 'Stop'
$name = 'bizeka-provider-' + [Guid]::NewGuid().ToString('N')
$password = 'Bzk!' + [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
if ($env:GITHUB_ACTIONS) { Write-Output "::add-mask::$password" }
$env:BIZEKA_PLATFORM_PROVIDERS = $Provider
$port = switch ($Provider) { Postgres { 15432 } SqlServer { 11433 } MySql { 13306 } }
$containerPort = switch ($Provider) { Postgres { 5432 } SqlServer { 1433 } MySql { 3306 } }
$arguments = @('run', '--detach', '--name', $name, '--publish', "127.0.0.1:${port}:$containerPort",
    '--health-interval', '3s', '--health-timeout', '3s', '--health-retries', '50')
switch ($Provider) {
    Postgres {
        $arguments += @('--env', "POSTGRES_PASSWORD=$password", '--health-cmd', 'pg_isready -U postgres', 'postgres:17')
        $env:BIZEKA_PLATFORM_PG = "Host=127.0.0.1;Port=$port;Username=postgres;Password=$password;Database=postgres;Pooling=false"
    }
    SqlServer {
        $arguments += @('--env', 'ACCEPT_EULA=Y', '--env', "MSSQL_SA_PASSWORD=$password", '--health-cmd',
            '/opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1"',
            'mcr.microsoft.com/mssql/server:2022-latest')
        $env:BIZEKA_PLATFORM_SQL = "Server=127.0.0.1,$port;User ID=sa;Password=$password;Database=master;TrustServerCertificate=true;Pooling=false"
    }
    MySql {
        $arguments += @('--env', "MYSQL_ROOT_PASSWORD=$password", '--health-cmd',
            'mysqladmin ping -h127.0.0.1 -uroot -p"$MYSQL_ROOT_PASSWORD"', 'mysql:8.4')
        $env:BIZEKA_PLATFORM_MYSQL = "Server=127.0.0.1;Port=$port;User ID=root;Password=$password;Database=mysql;Pooling=false"
    }
}
try {
    & docker @arguments | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Provider container did not start.' }
    $healthy = $false
    for ($attempt = 0; $attempt -lt 50; $attempt++) {
        $state = & docker inspect --format '{{.State.Health.Status}}' $name
        if ($LASTEXITCODE -ne 0) { throw 'Provider container is unavailable.' }
        if ($state -eq 'healthy') { $healthy = $true; break }
        if ($state -eq 'unhealthy') { throw 'Provider failed its readiness check.' }
        Start-Sleep -Seconds 3
    }
    if (-not $healthy) { throw 'Provider readiness deadline exceeded.' }
    dotnet test tests/Bizeka.Integration.Tests -c Release --no-build --no-restore
    if ($LASTEXITCODE -ne 0) { throw 'Provider tests failed.' }
}
finally {
    & docker rm --force $name | Out-Null
    foreach ($key in 'BIZEKA_PLATFORM_PG', 'BIZEKA_PLATFORM_SQL', 'BIZEKA_PLATFORM_MYSQL', 'BIZEKA_PLATFORM_PROVIDERS') {
        [Environment]::SetEnvironmentVariable($key, $null, 'Process')
    }
}

$py = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$dir = $PSScriptRoot
$p = Start-Process -FilePath $py -ArgumentList @('-m', 'http.server', '8000', '--bind', '127.0.0.1', '--directory', $dir) -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 2
if ($p.HasExited) {
  Write-Output "SERVER EXITED: $($p.ExitCode)"
  exit 1
}
Write-Output "SERVER PID: $($p.Id)"
$r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/' -UseBasicParsing
Write-Output "HTTP $($r.StatusCode)"

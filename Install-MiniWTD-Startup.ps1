param(
  [int]$Port = 8080,
  [string]$ProjectDir = "C:\Projets\Mini-WTD"
)

$taskName = "Mini-WTD AutoStart"
$script   = Join-Path $ProjectDir "MiniWTD-Auto.ps1"

# Crée la tâche qui démarre à l’ouverture de session (avec délai 10s)
$action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoLogo -NoProfile -ExecutionPolicy Bypass -File `"$script`" -Port $Port"
$trigger = New-ScheduledTaskTrigger -AtLogOn -Delay (New-TimeSpan -Seconds 10)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 6)

# Supprime si elle existe déjà
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Lance Mini-WTD (php -S) au démarrage" | Out-Null
Write-Host "? Tâche planifiée créée : $taskName"

# Lance une fois maintenant
Start-Process powershell.exe "-NoLogo -NoProfile -ExecutionPolicy Bypass -File `"$script`" -Port $Port"
Write-Host "?? Mini-WTD se lance. Ouvre http://localhost:$Port"

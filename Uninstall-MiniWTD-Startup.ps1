$taskName = "Mini-WTD AutoStart"
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
  Write-Host "🧹 Tâche supprimée : $taskName"
} else {
  Write-Host "ℹ️ Aucune tâche '$taskName' trouvée."
}

# Optionnel : fermer le serveur sur 8080
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -Expand OwningProcess -Unique |
  ForEach-Object { try { Stop-Process -Id $_ -Force } catch {} }
Write-Host "🛑 Serveur arrêté (si présent)."

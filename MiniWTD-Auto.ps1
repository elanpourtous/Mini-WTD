<#  MiniWTD-Auto.ps1
    - Ouvre le pare-feu TCP 8080
    - Lance Mini-WTD (php -S 0.0.0.0:8080 -t public)
    - Attend la disponibilité du port et notifie
#>

param(
  [int]$Port = 8080,
  [string]$ProjectDir = "C:\Projets\Mini-WTD",
  [string]$PhpExe = "php.exe",                         # si besoin: "C:\php\php.exe"
  [string]$LogFile = "C:\Projets\Mini-WTD\logs\mini-wtd-server.log"
)

# --- Préparations
$ErrorActionPreference = "Stop"
if (!(Test-Path (Split-Path $LogFile))) { New-Item -ItemType Directory -Force -Path (Split-Path $LogFile) | Out-Null }
Add-Type -AssemblyName System.Windows.Forms | Out-Null

function Notify($title, $msg) {
  try {
    [System.Media.SystemSounds]::Asterisk.Play() | Out-Null
    $balloon = New-Object System.Windows.Forms.NotifyIcon
    $balloon.Icon = [System.Drawing.SystemIcons]::Information
    $balloon.BalloonTipTitle = $title
    $balloon.BalloonTipText = $msg
    $balloon.Visible = $true
    $balloon.ShowBalloonTip(3000)
    Start-Sleep -Milliseconds 500
    $balloon.Dispose()
  } catch { }
}

# --- Pare-feu
$ruleName = "Mini-WTD TCP $Port"
if (-not (Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue)) {
  New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $Port | Out-Null
}

# --- Si un ancien serveur écoute déjà, on le stoppe
$existing = (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
if ($existing) {
  $pids = ($existing | Select-Object -Expand OwningProcess | Sort-Object -Unique)
  foreach ($pid in $pids) { Try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } Catch {} }
  Start-Sleep 1
}

# --- Lancement du serveur
Set-Location $ProjectDir
$cmd = "$PhpExe -S 0.0.0.0:$Port -t public"
"[$(Get-Date -Format 'u')] START: $cmd" | Out-File -FilePath $LogFile -Append -Encoding UTF8

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName  = "powershell.exe"
$psi.Arguments = "-NoLogo -NoProfile -ExecutionPolicy Bypass -Command `"$cmd`""
$psi.WorkingDirectory = $ProjectDir
$psi.CreateNoWindow = $true
$psi.WindowStyle = 'Hidden'
$proc = [System.Diagnostics.Process]::Start($psi)

# --- Attente de disponibilité
$ok = $false
for ($i=0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  $test = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -WarningAction SilentlyContinue
  if ($test.TcpTestSucceeded) { $ok = $true; break }
}

if ($ok) {
  "[$(Get-Date -Format 'u')] READY on http://localhost:$Port" | Out-File -FilePath $LogFile -Append -Encoding UTF8
  Notify "Mini-WTD prêt" "Localhost : http://localhost:$Port"
} else {
  "[$(Get-Date -Format 'u')] ERROR: port $Port indisponible" | Out-File -FilePath $LogFile -Append -Encoding UTF8
  Notify "Mini-WTD erreur" "Port $Port indisponible."
}

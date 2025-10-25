$dst = 'C:\Projets\Mini-WTD\public\a11y-log.php'
@'
<?php
/**
 * Mini-WTD · a11y-log.php
 * Réception d'événements (TTS, etc.) et écriture dans /logs/a11y.log
 */
header('Content-Type: application/json; charset=utf-8');

$baseDir = dirname(__DIR__);
$configFile = $baseDir . '/config/status_token.txt';
$logDir  = $baseDir . '/logs';
$logFile = $logDir . '/a11y.log';

if (!is_file($configFile)) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'missing_token_file']); exit; }
$validToken = trim((string)file_get_contents($configFile));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'method_not_allowed']); exit; }

$token = $_POST['token'] ?? '';
if ($token !== $validToken) { http_response_code(403); echo json_encode(['ok'=>false,'error'=>'bad_or_missing_token']); exit; }

$event   = $_POST['event']   ?? 'unknown';
$state   = $_POST['state']   ?? 'unknown';
$channel = $_POST['channel'] ?? 'generic';
$src     = $_POST['src']     ?? 'unknown';
$page    = $_POST['page']    ?? 'unknown';
$ts      = $_POST['ts']      ?? date('c');
$ip      = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$agent   = $_SERVER['HTTP_USER_AGENT'] ?? '-';

if (!is_dir($logDir)) { @mkdir($logDir, 0775, true); }

$line = sprintf("%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n", $ts, $ip, $channel, $event, $state, $src, $page, $agent);
file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

echo json_encode(['ok'=>true]);
?>
'@ | Set-Content -Path $dst -Encoding ASCII

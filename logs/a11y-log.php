<?php
/**
 * Mini-WTD · a11y-log.php
 * Réception des événements vocaux et IA (TTS, STT, RGAA…)
 * Enregistre dans /logs/a11y.log avec timestamp et token.
 */

header('Content-Type: application/json; charset=utf-8');

// === Configuration
$baseDir = dirname(__DIR__);
$configFile = $baseDir . '/config/status_token.txt';
$logDir = $baseDir . '/logs';
$logFile = $logDir . '/a11y.log';

// === Vérifie présence du token
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'missing_token_file']);
    exit;
}
$validToken = trim(file_get_contents($configFile));

// === Lecture POST
$input = $_POST ?: [];
$token = $input['token'] ?? '';
if ($token !== $validToken) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'bad_or_missing_token']);
    exit;
}

// === Création dossier logs si besoin
if (!is_dir($logDir)) {
    mkdir($logDir, 0775, true);
}

// === Données reçues
$event   = $input['event']   ?? 'unknown';
$state   = $input['state']   ?? 'unknown';
$channel = $input['channel'] ?? 'generic';
$src     = $input['src']     ?? 'unknown';
$page    = $input['page']    ?? 'unknown';
$ts      = $input['ts']      ?? date('c');
$ip      = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$agent   = $_SERVER['HTTP_USER_AGENT'] ?? '-';

// === Format log
$line = sprintf(
    "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n",
    $ts, $ip, $channel, $event, $state, $src, $page, $agent
);

// === Écriture
file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

echo json_encode(['ok' => true]);
?>

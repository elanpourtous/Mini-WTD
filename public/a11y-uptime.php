<?php
// Mini-WTD · a11y-uptime.php — synthèse rapide de durée "speaking"
declare(strict_types=1);

$baseDir = dirname(__DIR__);
$logFile = "$baseDir/logs/a11y.log";
$tokenFile = "$baseDir/config/status_token.txt";

if (!is_file($tokenFile)) {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'missing_token_file']); exit;
}
$validToken = trim(file_get_contents($tokenFile));
$token = $_GET['token'] ?? '';
if ($token==='' || !hash_equals($validToken,$token)) {
  http_response_code(403);
  echo json_encode(['ok'=>false,'error'=>'bad_token']); exit;
}

$since = time() - 3600; // dernière heure
if (isset($_GET['since'])) {
  $s=$_GET['since'];
  if ($s==='10m') $since=time()-600;
  elseif($s==='30m') $since=time()-1800;
  elseif($s==='24h') $since=time()-86400;
}

if (!is_file($logFile)) {
  echo json_encode(['ok'=>true,'channels'=>[]]); exit;
}

$lines=array_slice(file($logFile,FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES),-50000);
$tts=[];
$now=time();
foreach($lines as $L){
  [$ts,,,$evt,$state,$src]=$L."\t\t\t\t\t\t";
  $t=strtotime($ts);
  if($t<$since)continue;
  if($evt!=='tts_state')continue;
  $tts[]=['t'=>$t,'state'=>$state];
}

usort($tts,fn($a,$b)=>$a['t']<=>$b['t']);
$speaking_ms=0; $open=null;
foreach($tts as $e){
  if($e['state']==='speaking' && $open===null) $open=$e['t'];
  elseif($e['state']!=='speaking' && $open!==null){
    $speaking_ms+=($e['t']-$open)*1000;
    $open=null;
  }
}
if($open!==null) $speaking_ms+=($now-$open)*1000;

echo json_encode([
  'ok'=>true,
  'speaking_ms'=>$speaking_ms,
  'speaking_s'=>round($speaking_ms/1000,1),
  'window_since'=>date('c',$since),
  'window_now'=>date('c',$now)
],JSON_PRETTY_PRINT);

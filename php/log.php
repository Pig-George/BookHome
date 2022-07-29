<?php
    require_once('config.php');
    class Log {
	    private static $instance;
	    private $pid;
	    private $path = LOG_PATH;
	    private $autoClearTime = LOG_AUTO_CLEAR_TIME;
	    private $setLogOutTime = LOG_SET_LOG_OUTTIME;
	    private $tmpLogsMaxSize = LOG_TMP_LOGS_MAXSIZE;
	    private $logs = array();
	    private $setLogTime = 0;
	    private function __construct() {
		    $this->pid = uniqid();
		    if(!is_dir($this->path)) @mkdir($this->path, 0777, true);
	    }
	    
	    public function __destruct() {
		    $this->setLog();
	    }

	    public static function getLog() {
		    if(self::$instance == NULL) self::$instance = new self();
		    return self::$instance;
	    }
            public function getAutoClearTime() {
	    	    return $this->autoClearTime;
	    }

	    public function setAutoClearTime($time) {
	    	    $this->autoClearTime = $time;
	    }


	    public function getTmpLogsMaxSize() {
		    return $this->tmpLogsMaxSize;
	    }

	    public function setTmpLogsMaxSize($size) {
		    $this->tmpLogsMaxSize = $size;
	    }	

	
	    public function add($log, $level) {
		    if(!is_string($log)) $log = print_r($log, true);
		    $str = date('Y-m-d H:i:s', time()) . ' : ' . $this->pid . ' | ' . $level . ' | '. $log . PHP_EOL;
		    $file = $this->path . '/' . date('Y-m-d', time()) . '.log';
		    $this->logs[] = array('file' => $file, 'str' => $str);
		    if(count($this->logs) >= $this->tmpLogsMaxSize || $this->setLogOutTime < time() - $this->setLogTime) {
			    $this->setLog();
		    }
	    }

	    public function setLog() {
		    $logs = array_splice($this->logs, 0, count($this->logs));
		    $setLogTime = $this->setLogTime;
		    $sec = time();
		    $datas = array();
		    $paths = array();
		    while (count($logs)) {
			$log = array_shift($logs);
			$str = $log['str'];
			    $file = $log['file'];
			$path = dirname($file);
			if (!file_exists($path)) {
			    @mkdir($path, 0777, true);
			}
			if (!isset($datas[$file])) {
			    $datas[$file] = array();
			}
			$datas[$file][] = $str;
			$paths[$path] = $path;
		    }
		    $prefix = date("Y-m-d H:i:s", $sec) . ' | pid:' . $this->pid;
		    foreach ($datas as $file => $strs) {
			$str = $prefix . ' | 日志写入文件 | ' . $setLogTime . ' | ' . sprintf('%0' . strlen($setLogTime) . 'd', count($strs)) . ' | ' . $file . PHP_EOL . implode('', $strs);
			@file_put_contents($file, $str, FILE_APPEND);
		    }
		    foreach ($paths as $path) {
			foreach (glob($path . '/*.*') as $fn) {
			    if (is_file($fn) && @filemtime($fn) < $sec - $this->autoClearTime) {
				@unlink($fn);
			    }
			}
		    }
		    $this->setLogTime = $sec;
	    }


    }
    $Log = Log::getLog();
?>

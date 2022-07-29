<?php
	require_once('config.php');
	require_once('mysql.php');
	
	
	//$key :string   $data :array(key => val)   $is_reset :bool
	function setSession($key, $dataArr, $is_reset = true) {
		session_start();
		if((!$is_reset) && isset($_SESSION[$key])) {
			$sessionArr = json_decode($_SESSION[$key], true); //第二参数为：true    则转换为关联数组
			foreach($dataArr as $k => $v) {
				$sessionArr[$k] = $v;
			}
			$dataArr = $sessionArr;
		}
		$_SESSION[$key] = json_encode($dataArr);
	}
	
	function getCookie() {
		global $Mysql;
		$cookie = sha1(time());
		while(($Mysql->query("SELECT uid FROM user WHERE cookie='{$cookie}'"))->num_rows) {
			$cookie = sha1(time());
		}
		return $cookie;
	}

	//$is_succeed:bool  $echo_data:string  $user_data:array(key => val);
	function send($is_succeed, $echo_data = NULL, $user_data = NULL) {
		$dataArr['is_succeed'] = $is_succeed;
		$echo_data ? $dataArr['echo_data'] = $echo_data : 0;
		if($user_data) {
			$dataArr['user_data'] = $user_data;
		}
		echo json_encode($dataArr);
	}



	function notLoginError() {
		send(true, NULL, ['notLogin'=>true]);
		exit();
	}

	function arguError() {
		echo '{"is_succeed":false}';
		exit();
	}
	
	function dataError() {
		echo '{"is_succeed":false,"echo_data":"数据异常！请重新登录"}';
		exit();
	}
	
	
	
	
	
	//凌晨   早   上    中    下    晚
	function getTimeStr() {
		$hour = date('G');
		switch(floor(intval($hour) / 4.0)) {
			case(0) : return '凌晨';
			case(1) : return '早上';
			case(2) : return '上午';
			case(3) : return '中午';
			case(4) : return '下午';
			case(5) : return '晚上';
			default :;
		}
	}

	
	function selectName($uname) {
		global $Mysql;
		$result = $Mysql->preareSelect('user', 'uname', $uname, ['uid']);
		if($result) {
			if($result->num_rows > 0) return true;
			else return false;
		}
		else arguError();
	}
	
	
?>

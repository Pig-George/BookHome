<?php
	require_once('debug.php');
	require_once('config.php');
	require_once('log.php');
	require_once('mysql.php');
	require_once('sendEmail.php');
	require_once('tools.php');
	require('EmailHtml.php');
	
	
	//查询用户名是否存在接口：
	function unameIsExist() {
		if(selectName($_GET['uname'])) {
			send(true);
		} else {
			send(false);
		}
	}
	
	//重新设置cookie接口
	function resetCookie($last_cookie) {
		global $Mysql, $Log;
		$cookie = getCookie();
		if(!is_int($Mysql->preareUpdate('user', ['cookie'=>$cookie], 's', "cookie='$last_cookie'"))) {
			return $cookie;
		} else {
			$Log->add('setCookie错误！', 'warning');
			return false;
		}
	}
	
	//忘记密码接口
	//待实现email密码找回
	function forgetPwd() {
		global $Mysql;
		$result = $Mysql->preareSelect('user', 'uname', $_POST['uname']);
		$row = $result->fetch_assoc();
		if($row['uemail'] == $_POST['uemail']) {
			if($row['is_forgetPwd'] == NULL) {
				//~ $Mysql->query("UPDATE user SET ,forgetPwd_time=now(),update_time=now() WHERE uid={$row['uid']}")
				//~ $my_url = 'http://' . MY_DOMAIN_NAME . '/php/forgetPwd.php?id' .  
				//~ sendEmail("{$row['uemail']}", '书坊密码找回', EmailHtml\getForgetPwdHtml($row['uname'], ));
				sendEmail("{$row['uemail']}", '书坊密码找回', '待开发...');
				send(true, '请在收到邮件后及时重置密码！');
			} else send(true, '请求已发送到您的电子邮箱');
		} 												
		else send(false, '请使用注册时输入的邮箱！');
	}
	
	//登录入口：
	function login() {
		global $Mysql;
		$selectArr = ['uname', 'pwd', 'uHeadPortraitSrc', 'uSign', 'cookie'];
		$result = $Mysql->preareSelect('user', 'uname', $_POST['uname'], $selectArr);
		if(!is_int($result)) {
			$row = $result->fetch_assoc();
			if(password_verify($_POST['upwd'], $row['pwd'])) {
				if($cookie = resetCookie($row['cookie'])) {
					setcookie('code', $cookie, time() + COOKIE_OUT_TIME);
					unset($row['pwd']);
					unset($row['cookie']);
					$row['uHeadPortraitSrc'] = USER_HEAD_PORTRAIT_PATH . '/' . $row['uHeadPortraitSrc'];
					$timer = getTimeStr();
					send(true, "{$timer}好！{$row['uname']}", $row);
				} else arguError();
			} else send(false, '密码错误！');
		} else send(false);
	}
	
	//发送验证码接口
	function sendAuthCode() {
		global $Mysql;
		if(filter_var($_GET['uemail'], FILTER_VALIDATE_EMAIL)) {
			$authCode = rand(100000, 999999);
			$Mysql->preareInsert('authCode', 'si', ['uemail'=>$_GET['uemail'], 'authCode'=>$authCode]);
			sendEmail($_GET['uemail'], "电子邮件验证码：$authCode", EmailHtml\getAuthCodeHtml($authCode, AUTHCODE_OUT_TIME));
			send(true);
		} else send(false, '请检查邮箱是否正确！');
	}
	
	
	//注册入口
	function signIn() {
		global $Mysql, $Log;
		if(strlen($_POST['upwd']) >= 6) {
			if(filter_var($_POST['uemail'], FILTER_VALIDATE_EMAIL)) {
				$Mysql->query("DELETE FROM authCode WHERE (now() - create_time) > " . (AUTHCODE_OUT_TIME * 60));
				$result = $Mysql->preareSelect('authCode', 'uemail', $_POST['uemail'], ['id','authCode']);
				if($result->num_rows) {
					$row = $result->fetch_assoc();
					if($row['authCode'] == $_POST['auth_code']) {
						if(!$Mysql->query("DELETE FROM authCode WHERE id={$row['id']}")) $Log-add('authCode删除失败！', 'error');
						$cookie = getCookie(); //获取使用sha1算法得到的 cookie 
						$pwd = password_hash($_POST['upwd'], PASSWORD_DEFAULT);
						$uHeadPortraitSrc = 'a' . rand(1, 9).'.jpg';
						$insertData = ['uname'=>$_POST['uname'], 'pwd'=>$pwd, 'uHeadPortraitSrc'=>"$uHeadPortraitSrc", 'uemail'=>$_POST['uemail'], 'cookie'=>$cookie];
						$target = $Mysql->preareInsert('user', 'sssss', $insertData);
						if(!is_int($target)) {
							setcookie('code', $cookie, time() + COOKIE_OUT_TIME);
							$uHeadPortraitSrc = USER_HEAD_PORTRAIT_PATH . '/' . $uHeadPortraitSrc;
							send(true, "欢迎新同学：{$_POST['uname']}", ['uname'=>$_POST['uname'], 'uHeadPortraitSrc'=>$uHeadPortraitSrc]);
						} else {
							$Log->add('数据库用户注册信息插入失败！', 'error');
							send(false);
						}
					} else send(false, '验证码错误！');
				} else send(false, '验证码已过期，请尝试重新获取验证码');
			} else send(false, '请填写有效的邮箱地址！');
		} else send(false);
	}
	
	
	// 入口：
	//1、先判断用户名是否符合要求
	//2、判断是否是登录还是注册
	// 是登录：判断是否忘记密码
	// 是注册：...
	function in() {
		if((!empty($_POST['uname'])) && preg_match('/^[A-Za-z0-9_\x{4e00}-\x{9fa5}]+$/u', $_POST['uname'])) {
			if($_POST['is_login'] == 'true') {
				if(selectName($_POST['uname'])) {
					if($_POST['is_forget_pwd'] == 'true') {
						forgetPwd();
					} else {
						login();
					}
				} else send(false, '用户名未注册！');
			} else if(!selectName($_POST['uname'])) {
				signIn();
			} else send(false, '用户名已注册！'); 
		} else {
			echo send(false, '用户名错误！');
		}
	}
	
	try{
		if(isset($_GET['mode'])) {
			switch($_GET['mode']) {
				case(0) : unameIsExist();break;
				case(1) : sendAuthCode();break;
				//case(...) : 
				default : arguError();
			}
		} else if(isset($_POST['mode'])) {
			switch($_POST['mode']) {
				case(0) : in();break;
				//case(...) :
				default: arguError();
			}
		}
	}catch(Exception $e) {
		arguError();
		$Log->add($e->getMessage());
	}
?>

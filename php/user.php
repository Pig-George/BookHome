<?php
	require_once('debug.php');
	require_once('config.php');
	require_once('log.php');
	require_once('mysql.php');
	require_once('tools.php');
	
	function upUserInfo() {
		global $Mysql;
		$type = ['uid' => 'i', 'uname'=>'s', 'pwd'=>'s', 'uSign'=>'s', 'uemail' => 's', 'cookie' => 's'];
		$updateNames = array_intersect_key($_GET, $type);
		$type_str = '';
		foreach($updateNames as $key=>$val) {
			$type_str .= $type[$key];
		}
		$result = $Mysql->preareUpdate('user', $updateNames, $type_str, "cookie = '{$_COOKIE['code']}'");
		if(!is_int($result)) {
			send('true', NULL, $updateNames);
		} else {
			arguError();
		}
	}
	
	function getUserInfo() {
		$row;
		global $Log, $Mysql;
		$selectName = 'uname, uHeadPortraitSrc, uSign';
		$result = $Mysql->query("SELECT $selectName FROM user WHERE cookie='{$_COOKIE['code']}'");
		if($result && $result->num_rows) {
			$row = $result->fetch_assoc();
			$row['uHeadPortraitSrc'] = USER_HEAD_PORTRAIT_PATH . '/' . $row['uHeadPortraitSrc'];
			if((!isset($_GET['isAll'])) || $_GET['isAll'] == false) {
				foreach($row as $key=>$val) {
					if(!array_key_exists($key, $_GET)) {
						unset($row[$key]);
					}
				}
			}
			send(true, NULL, $row);
		} else {
			setcookie('code', '', time() - 3600);
			arguError();
		}
		
	}
	
	
	function upHeadPortrait() {
		global $Mysql, $Log;
		if(isset($_FILES['headPortrait']) && $_FILES['headPortrait']['error'] == 0) {
			$allowedExts = ['gif', 'jpeg', 'jpg', 'png', 'x-png'];
			$type = $_FILES['headPortrait']['type'];
			$type = substr($type, strrpos($type, '/') + 1);
			if(array_search($type, $allowedExts)) {
				if($_FILES['headPortrait']['size'] <= USER_UPIMG_SIZE) {
					$result = $Mysql->query("SELECT uid FROM user WHERE cookie='{$_COOKIE['code']}'");
					if($result) {
						$row = $result->fetch_assoc();
						if(!is_dir(USER_HEAD_PORTRAIT_PATH)) @mkdir(USER_HEAD_PORTRAIT_PATH, 0777, true);
						$fileName = $row['uid']. '.' . $type;
						$is_succeed = move_uploaded_file($_FILES['headPortrait']['tmp_name'], USER_HEAD_PORTRAIT_PATH . '/' . $fileName);
						if($is_succeed) {
							if($Mysql->query("UPDATE user SET uHeadPortraitSrc='$fileName' WHERE cookie='{$_COOKIE['code']}'")) {
								send(true, '头像更新成功', ['uHeadPortraitSrc'=>USER_HEAD_PORTRAIT_PATH . '/' . $fileName]);
							} else {
								$Log->add('数据库存储用户头像路径错误！', 'error');
							}
						} else {
							$Log->add('用户头像更新失败！', 'error');
							send(false, '出错啦！！！请重试');
						}
					} else {
						dataError();
					}
				} else send(false, '换一个小点的头像试试');
			} else send(false, '暂不支持此类型的图片哦');
			
		} else arguError();
	}
	
	
	function outLogin() {
		setcookie('code', '', time() - 3600);
		send(true);
	}
	

	try {
		if(isset($_COOKIE['code']) && $Mysql->preareSelect('user', 'cookie', $_COOKIE['code'])->num_rows) {
			if(count($_GET)) {
				switch($_GET['mode']) {
					case(-1) : outLogin();break;
					case(0) : upUserInfo();break;
					case(1) : getUserInfo();break;
					//case(...) :
					default : arguError();
				}
			} else if(count($_POST)) {
				switch($_POST['mode']) {
					case(0) : upHeadPortrait();break;
					//case(...) :
					
					default : arguError();
				}
			}
		}else notLoginError();
	} catch(Exception $e) {
		//~ echo $e->getMessage().PHP_EOL;
		arguError();
		$Log->add($e->getMessage());
	}
	
?>

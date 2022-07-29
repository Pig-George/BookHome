<?php
	require_once('mysql.php');
	require_once('log.php');
	
	if(isset($_GET['id'])) {
		setcookie('test', '12345');
		echo '<form action="http://bookhome.vaiwan.com/php/forgetPwd.php" method="post">
				<input type="text" name="userName">
				<input type="text" name="userPwd">
				<button type="submit" value="提交">
			</form>';
	} else if(isset($_POST['userName'])&&isset($_POST['userPwd'])) {
		echo $_COOKIE['test'];
	}else echo "{\"code\":0}";
	

?>

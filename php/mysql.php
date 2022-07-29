<?php
	require_once('config.php');
	require_once('log.php');
	class Mysql {
		private static $instance;
		private $link;
		private function __construct() {
			$this->link = new mysqli(SQL_SERVER_NAME, SQL_USER_NAME, SQL_UPWD, SQL_DB_NAME);
			if($this->link->connect_error) {
				global $Log;
				$Log->add('数据库连接失败!', 'error');
				return NULL;
			}
		}
		public function __destruct() {
			if(self::$instance != NULL) $this->link->close();
		}
		
		
		public static function getMysql() {
			if(self::$instance == NULL) self::$instance = new self;
			return self::$instance;
		}
		
		private function preare($SQL_STR, $data, &$type_str) {
			$stmt = $this->link->prepare($SQL_STR);
			@array_unshift($data, $type_str);
			@call_user_func_array(array($stmt, 'bind_param'), $data);		//数据绑定
			if(!$stmt) {
				global $Log;
				$Log->add('数据库bind_param错误！', 'warning');
				return -1;			//数据绑定错误
			}
			$stmt->execute();
			if($stmt->errno) {
				return -2;			//数据提交后数据库报错
			}
			return $stmt->get_result();
		}
		
		//适用于用单个条件查找内容， 不适用于多条件查找    但大大提高查找的安全性
		//$tableName :string  $selectData :string  $selectName :string $getName :array();
		public function preareSelect($tableName, $selectName, $selectData, $getName = ['*'], $type = 's') {
			$getName = implode(',', $getName);
			$str = "SELECT $getName FROM $tableName WHERE $selectName = ?";
			return $this->preare($str, [$selectData], $type);
		}


		//支持设定字段插入
		//$tableName :string   $type_str :string  $insertData :array(insertName=>insertData)
		public function preareInsert($tableName, $type_str, $insertData) {
			$insertName = '';
			$insertData_tmp = '';
			foreach($insertData as $key=>$val) {
				$insertName .= $key . ',';
				$insertData_tmp .= '?,';
			}
			$insertName = substr($insertName, 0, strlen($insertName) - 1);
			$insertData_tmp = substr($insertData_tmp, 0, strlen($insertData_tmp) - 1);
			$str = "INSERT INTO $tableName ($insertName) VALUES($insertData_tmp)";
			//echo $str;
			return $this->preare($str, $insertData, $type_str);
		}
		
		
		
		//tableName :string   updateData :array('updateName' => 'updateData')    $type :string    $updatePos :string
		public function preareUpdate($tableName, $updateData, $type,  $updatePos) {
			$str = "UPDATE $tableName SET " . key($updateData) . "=?,update_time=now() WHERE $updatePos";
			return  $this->preare($str, $updateData, $type);
		}
		
		
		//$tableName :string   $deleteData :array('$deletekey' => 'deleteData')    $type :string
		public function preareDelete($tableName, $deleteData, $type) {
			$str = "DELETE FROM $tableName WHERE " . key($deleteData) . "=?";
			return $this->preare($str, $deleteData, $type);
		}

		public function query($command) {
			$target = $this->link->query($command);
			if(!$target) {
				global $Log;
				$Log->add('数据库query方法执行错误!', 'warning');
			}
			return $target;
		}
		
	}
	
	$Mysql = Mysql::getMysql();
?>

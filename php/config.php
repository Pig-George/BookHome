<?php
    //sql:
    define('SQL_SERVER_NAME', 'localhost');
    define('SQL_USER_NAME', 'BookHome');
    define('SQL_UPWD', '');
    define('SQL_DB_NAME', 'BookHome');
    
    //log:
    define('LOG_PATH', '../../log');
    define('LOG_AUTO_CLEAR_TIME', 200);
    define('LOG_SET_LOG_OUTTIME', 2592000);  //30天
    define('LOG_TMP_LOGS_MAXSIZE', 100);
    
    //email:
    define('EMAIL_USER', 'pig-george@qq.com');
    define('EMAIL_PWD', '');
    define('EMAIL_HOST', 'smtp.qq.com');
    define('EMAIL_PORT', 465);
    
    //url:
    define('MY_DOMAIN_NAME', 'www.bookname.vaiwan.com');
    define('CRWAL_SITE_URL', '');
    define('REQUEST_IP_URL', 'https://ip.useragentinfo.com/json?ip=');
    
    //upfile:
    define('USER_UPIMG_SIZE', 204800);	//200k
    define('USER_HEAD_PORTRAIT_PATH', '../img');
    
    //cookie
    define('COOKIE_OUT_TIME', 60 * 60 * 24 * 3);  // unit : s
    
    //authCode
    define('AUTHCODE_OUT_TIME', 1)  // unit : min
?>

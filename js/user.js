import { simulationTyping, UserInfo as userInfo } from "./class.js";
var dynamic_title = document.getElementById('dynamic_title');
var dynamic_title_simulationTyping = new simulationTyping(dynamic_title, '<span>&nbsp;</span>');


//登录/注册接口
function Login() {
	
	$('#login').slideDown();
	//请求地址
	const REQUEST_URL = 'php/signinLogin.php';
	
	//会话常量：
	const INIT_STR = '您还未登录，请登录/注册 🔒';
	const USER_SIGN_IN = '欢迎注册书坊 😊😊😊';
	const USER_LOGIN = '请登录 👀  👀';
	const USER_MAIL = '请输入有效的邮箱 📧'
	const UERR_NAME = '用户名错误 ❗ ❗ ❗ (不得包含特殊字符)';
	const UERR_NAME_EMPTY = '用户名为空 ❗ ❗ ❗ ';
	const UERR_NAME_NOT_FIND = '用户名未注册 ❌';
	const UERR_NAME_REPAET = '用户名已被注册 ❌';
	const UERR_PWD_SIZE = '密码不能小于6位 ❌❌❌';
	const UERR_PWD = '密码不匹配 ❌❌❌';
	const UERR_AUTHCODE = '验证码为6位字符 ❗'
	const UOK_NAME = '请输入密码 🔑 🙈';
	const UOK_PWD = '请确认密码 🔐 🙈';
	const UOK_FORGET = '点击找回，在访问邮箱链接后可重设密码 📬';
	const UOK_PWD_LOGIN = '🔓';
	const UOK_EMAIL = '点击获取验证码';
	const UOK_GET_AUTHCODE = '请输入邮箱收到的验证码 📫';
	const UOK_PWD_SINGIN = '点击注册 ❕';
	const LOAD = '🌝 🌖 🌗 🌘 🌚 🌒 🌓 🌔 🌝 大概是失败了 . . .';
	
	//类样式选择：
	const SUCCEED_INPUT = 'succeed_input';
	const FILL_INPUT = 'fill_input';
	
	//DOM变量：
	var login_head_nav = document.getElementById('login_head_nav');
	var user_form_change = document.getElementById('user-form-change');
	var forget_pwd = document.getElementById('forget_pwd');
	var user_change_button = document.getElementById('user-change-button');
	var user_form_event = document.getElementById('user-form-event');
	var uname_input = document.getElementById('uname');
	var upwd_input = document.getElementById('upwd');
	var sure_pwd = document.getElementById('sure_pwd');
	var dispaly_pwd_all = document.querySelectorAll('#display_pwd');
	var uemail_input = document.getElementById('uemail');
	var auth_code = document.getElementById('auth_code')
	var send_authCode_button = document.getElementById('send_auth_code');
	var submit_button = document.getElementById('submit_button');
	
	
	//初始化会话：
	dynamic_title_simulationTyping.change(INIT_STR);
	
	//ajax请求 对象
	var ajax = {
		url : REQUEST_URL,
		get : function(dataObj, callFun) {
			$.get(this.url, dataObj,
			(data, targer) => {
				if(targer === 'success') {
					console.log(data);
					let now_data = JSON.parse(data);
					if(now_data.echo_data) dynamic_title_simulationTyping.change(now_data.echo_data);
					if(callFun) callFun(now_data);
				}
			})
		},
		
		
		post : function() {
			$.post(this.url, 
			{
				mode : 0,
				is_forget_pwd : Boolean(is_forget_pwd),
				is_login : Boolean(is_login),
				uname : uname_input.value,
				upwd : upwd_input.value,
				uemail : is_login?upwd_input.value:uemail_input.value,
				auth_code : auth_code.value
			},
			(data, targer) => {
				if(targer === 'success') {
					console.log(data);
					let now_data = JSON.parse(data);
					if(now_data.echo_data) dynamic_title_simulationTyping.change(now_data.echo_data);
					if(now_data.is_succeed && now_data.user_data) {
						//注销已注册事件
						user_change_button.removeEventListener('click', user_change_func);
						uname_input.removeEventListener('blur', uname_input_func);
						upwd_input.removeEventListener('blur', upwd_input_func);
						sure_pwd.removeEventListener('blur', sure_pwd_func);
						uemail_input.removeEventListener('blur', uemail_input_func);
						auth_code.removeEventListener('blur', auth_code_func)
						send_authCode_button.removeEventListener('click', send_authCode_button_func)
						submit_button.removeEventListener('click', submit_button_func)
						forget_pwd.removeEventListener('click', forget_pwd_func);
						
						//转到User页面
						User(now_data.user_data);
					}
				} 
			})
			
		}
	}
	
	
	function check_uname_callFun(dataObj) {
		if(dataObj.is_succeed) {
			if(!is_login) {
				uname_input.className = FILL_INPUT;
				dynamic_title_simulationTyping.change(UERR_NAME_REPAET, 100);
			}
		} else if(is_login){
			uname_input.className = FILL_INPUT;
			dynamic_title_simulationTyping.change(UERR_NAME_NOT_FIND, 100);
		}
	}
	
	
//控制变量：
	var is_login = true;
	var uname_flag = false;
	var upwd_flag = false;
	var sure_pwd_flag = false;
	var uemail_flag = false;
	var authCode_input_size_flag = false;
	var is_forget_pwd = false;
	var send_authCode_button_id = -1;
	
	//表单输入检测函数
	function emial_check(str) {
		return str.search(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi);
	};
				
	function check_all_err () {
		if(!uname_flag) {
			if(uname_input.value.length == 0) return UERR_NAME_EMPTY;
			else return UERR_NAME;
		}
		if(is_login) {
			if(is_forget_pwd) {
				if(!upwd_flag) return USER_MAIL;
			}
			if(!upwd_flag) return UERR_PWD_SIZE;
		}
		if(!upwd_flag) return UERR_PWD_SIZE;
		if(!sure_pwd_flag) return UERR_PWD;
		if(!uemail_flag) return  USER_MAIL;
		if(!authCode_input_size_flag) return UERR_AUTHCODE;
	};
			
	//注册事件绑定方法
	function user_change_func () {
		if(is_login) {
			sure_pwd.disabled = uemail_input.disabled = auth_code.disabled = '';
			if(send_authCode_button_id == -1) send_authCode_button.disabled = '';
			user_form_change.style.height = '335px';
			user_form_event.style.top = '175px';
			login_head_nav.style.right = '120px';
			user_change_button.innerHTML = '登录';
			submit_button.value = '注册';
			$('#uname, #upwd, #sure_pwd, #uemail').css('margin-bottom', '25px');
			forget_pwd.style.opacity = '0';
			forget_pwd.style.cursor = 'default';
			dynamic_title_simulationTyping.change(USER_SIGN_IN);
		} else {
			sure_pwd.disabled = uemail_input.disabled = auth_code.disabled = send_authCode_button.disabled = 'disabled';
			sure_pwd.value = '';
			user_form_change.style.height = '160px';
			user_form_event.style.top = '-30px';
			login_head_nav.style.right = '0';
			user_change_button.innerHTML = '注册';
			submit_button.value = '登录';
			$('#uname, #upwd, #sure_pwd, #uemail').css('margin-bottom', '40px');
			forget_pwd.style.opacity = '1';
			forget_pwd.style.cursor = 'pointer';
			sure_pwd.className = uemail_input.className = auth_code.className = '';
			dynamic_title_simulationTyping.change(USER_LOGIN);
			sure_pwd_flag = false;
		}
		is_login ^= 1;
	};
			
	function uname_input_func () {
		let val = uname_input.value;
		if(!val.length) {
			uname_input.className = FILL_INPUT;
			dynamic_title_simulationTyping.change(UERR_NAME_EMPTY);
			uname_flag = false;
			return;
		}
		if(val.search(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/gi) == -1) {
			uname_input.className = FILL_INPUT;
			dynamic_title_simulationTyping.change(UERR_NAME);
			uname_flag = false;
		} else {
			uname_input.className = SUCCEED_INPUT;
			if(!is_forget_pwd) dynamic_title_simulationTyping.change(UOK_NAME);
			else dynamic_title_simulationTyping.change(USER_MAIL);
			ajax.get({mode:0, uname:uname_input.value}, check_uname_callFun);
			uname_flag = true;
		}
	};
			
	function upwd_input_func () {
		if(!is_forget_pwd) {
			if(upwd_input.value.length < 6) {
				upwd_flag = false;
				upwd_input.className = FILL_INPUT;
				dynamic_title_simulationTyping.change(UERR_PWD_SIZE);
			} else {
				upwd_flag = true;
				upwd_input.className = SUCCEED_INPUT;
				if(uname_flag) {
					if(is_login) dynamic_title_simulationTyping.change(UOK_PWD_LOGIN);
					else dynamic_title_simulationTyping.change(UOK_PWD);
				} else {
					dynamic_title_simulationTyping.change(UERR_NAME);
				}
			}
		} else {
			if(emial_check(upwd_input.value) != -1) {
				upwd_flag = true;
				upwd_input.className = SUCCEED_INPUT;
				if(uname_flag) dynamic_title_simulationTyping.change(UOK_FORGET);
				else dynamic_title_simulationTyping.change(UERR_NAME);
			} else {
				upwd_flag = false;
				upwd_input.className = FILL_INPUT;
				dynamic_title_simulationTyping.change(USER_MAIL);
			}
		}
	};
			
	function sure_pwd_func () {
		if(sure_pwd.value === upwd_input.value) {
			if(sure_pwd.value.length >= 6) {
				sure_pwd_flag = true;
				sure_pwd.className = SUCCEED_INPUT;
				dynamic_title_simulationTyping.change(USER_MAIL);
			}
			else {
				sure_pwd_flag = false;
				sure_pwd.className = FILL_INPUT;
				dynamic_title_simulationTyping.change(UERR_PWD_SIZE);
			}
		} else {
			sure_pwd_flag = false;
			sure_pwd.className = FILL_INPUT;
			dynamic_title_simulationTyping.change(UERR_PWD);
		}
	};


	function uemail_input_func () {
		if(emial_check(uemail_input.value) != -1) {
			uemail_flag = true;
			uemail_input.className = SUCCEED_INPUT;
			dynamic_title_simulationTyping.change(UOK_EMAIL);
		} else {
			uemail_flag = false;
			uemail_input.className = FILL_INPUT;
			dynamic_title_simulationTyping.change(USER_MAIL);
		}
	};
			
	function auth_code_func () {
		if(auth_code.value.length < 6) {
			authCode_input_size_flag = false;
			auth_code.className = FILL_INPUT;
			dynamic_title_simulationTyping.change(UERR_AUTHCODE);
		} else {
			authCode_input_size_flag = true;
			auth_code.className = SUCCEED_INPUT;
			dynamic_title_simulationTyping.change(UOK_PWD_SINGIN);
		}
	};
			
	function send_authCode_button_func ()  {
		if(uname_flag && upwd_flag && sure_pwd_flag && uemail_flag) {
			ajax.get({mode:1, uemail: uemail_input.value});
			let time = 60;
			send_authCode_button.disabled = 'disabled';
			dynamic_title_simulationTyping.change(UOK_GET_AUTHCODE, 100);
			send_authCode_button_id = setInterval(() => {
				--time;
				if(time < 1) {
					send_authCode_button.disabled = '';
					send_authCode_button.value = '重新获取';
					clearInterval(send_authCode_button_id);
					send_authCode_button_id = -1;
				} else send_authCode_button.value = time + '秒后重新获取';
			}, 1000);
		} else dynamic_title_simulationTyping.change(check_all_err());
	};
			
	function submit_button_func ()  {
		if(uname_flag && upwd_flag && ( is_login || (sure_pwd_flag && uemail_flag && authCode_input_size_flag))) {
			ajax.post();
			dynamic_title_simulationTyping.change(LOAD, 800);
		}
		else dynamic_title_simulationTyping.change(check_all_err());
	};
			
	function forget_pwd_func () {
		is_forget_pwd ^= 1;
		if(is_forget_pwd == true) {
			dispaly_pwd_all[0].style.display = 'none';
			upwd_input.value = '';
			forget_pwd.innerHTML = '返回';
			upwd_input.type = 'text';
			upwd_input.placeholder = '邮箱地址';
			submit_button.value = '找回';
			upwd_input.style.borderColor = '#808080';
			user_change_button.style.display = 'none';
			dynamic_title_simulationTyping.change(USER_MAIL);
		} else {
			dispaly_pwd_all[0].style.display = '';
			upwd_input.value = '';
			forget_pwd.innerHTML = '忘记密码';
			upwd_input.type = 'password';
			dispaly_pwd_all[0].innerHTML = '';
			upwd_input.placeholder = '密码';
			submit_button.value = '登录';
			upwd_input.style.borderColor = '#808080';
			user_change_button.style.display = 'none';
			dynamic_title_simulationTyping.change(INIT_STR);
			user_change_button.style.display = '';
		}
	};
		
	
	//注册事件：
	user_change_button.addEventListener('click', user_change_func);
	uname_input.addEventListener('blur', uname_input_func);
	upwd_input.addEventListener('blur', upwd_input_func);
	sure_pwd.addEventListener('blur', sure_pwd_func);
	uemail_input.addEventListener('blur', uemail_input_func);
	auth_code.addEventListener('blur', auth_code_func)
	send_authCode_button.addEventListener('click', send_authCode_button_func)
	submit_button.addEventListener('click', submit_button_func)
	forget_pwd.addEventListener('click', forget_pwd_func);
	
	//密码框小眼睛：
	dispaly_pwd_all.forEach((item) => {
		item.onclick = function() {
			let pwd_input = this.parentNode.firstChild.nextSibling;
			// console.log(pwd_input);
			if(this.innerHTML == '') {
				pwd_input.type = 'text';
				this.innerHTML = '';
			} else {
				pwd_input.type = 'password';
				this.innerHTML = '';
			}
		}
	})
	
	
}

const REQUEST_URL = 'php/user.php';
var UserInfo = new userInfo(REQUEST_URL, dynamic_title_simulationTyping);
	
//用户页面接口
function User(data) {
	if(data) {
		$('#nav-user-info-footer').append('<span class="split-line"></span><div class="box-shadow hover-warning" id="nav-user-out"  class="box-shadow"><div>退出登录</div><h3></h3></div>');
		$('#nav-user-out').click(UserInfo.outLogin);
		UserInfo.setInfo(data);
	}
	titleTimeChange();
	
	$('#login').css('display', 'none');
	
	//显示user页面
	$('#user').css('display', '');
	$('#user-info').animate({'left':'0px','opacity':'1'}, 'fast');
	$('#user-data').animate({'right':'0px','opacity':'1'}, 'fast');
	//显示底部通栏
	$('#footer-1').fadeIn(3000);
	
	//初始化user参数

	
	
	
	/***********************监听事件***********************/
	
	//间接触发事件：
	$('#user-head-portrait-box>span').click(function() {
		$('#upfile').click();
	})
	
	//更换头像：
	$('#upfile').change(function () {
		var formData = new FormData();
		// console.log($('#upfile')[0].files[0]);
		formData.append('mode', 0);
		formData.append('headPortrait', $('#upfile')[0].files[0]);
		$.ajax({
			mode : 3,
			type: "POST",		//post方法
			url: REQUEST_URL,
			data:formData,
			contentType: false,
			processData: false,
			success: function(data) {
				UserInfo.call_back(data, 'success', UserInfo.setInfo);
			},
			error: function() {
				dynamic_title_simulationTyping.change('错误！！');
			}
		});
	})
	
	//个性签名:
	$('#user-sign').blur(function () {
		UserInfo.changeInfo({'uSign':$('#user-sign').val()}, UserInfo.setInfo);
	})
	
}

$(function() {
	if($.cookie('userInfo')) User();
	else Login();
})



function titleTimeChange() {
	var dir = 1;
	if(dynamic_title_simulationTyping.timer == -1) {
		dynamic_title_simulationTyping.change(getTimeStr());
	}
	setInterval(() => {
		if(dynamic_title_simulationTyping.timer != -1) return;
		let str = '';
		switch(dir) {
			case(0) : str = getTimeStr();break;
			case(1) : str = getDataStr();break;
			case(2) : str = getSignStr();
			default : dir = -1;
		}
		dynamic_title_simulationTyping.change(str);
		++dir;
		
	}, 30000);
}

function getTimeStr() {
	var hour = new Date().getHours();
	var str = '';
	switch(Math.floor(hour / 4.0)) {
		case(0) : str = '凌晨';break;
		case(1) : str = '早上';break;
		case(2) : str = '上午';break;
		case(3) : str = '中午';break;
		case(4) : str = '下午';break;
		case(5) : str = '晚上';break;
		default :;
	}
	str += '好！' + $('#user-name').text();
	return str;
}

function getDataStr() {
	var timer = new Date();
	var year = timer.getFullYear();
	var last_date = Math.ceil((new Date(String(year + 1), '0', '1') - timer) / 86400000);
	var str = '今天是' + year + '年' + (timer.getMonth() + 1) + '月' + timer.getDate() + '日，距' + (year + 1) + '年还有' + last_date + '天！';
	return str;
}


function getSignStr() {
	return 	'书山有路勤为径，学海无涯苦作舟！';
}


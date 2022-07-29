import { simulationTyping, UserInfo } from './class.js';

const REQUEST_URL = 'php/user.php';
var userInfo = new UserInfo(REQUEST_URL);

// nav栏用户信息更新：
function getUserInfo() {
	if($.cookie('userInfo') !== undefined) {
		let dataObj = {};
		try{
			dataObj = JSON.parse($.cookie('userInfo'));
		}catch(e) {
			$.removeCookie('userInfo');
			getUserInfo();
		}
		userInfo.setInfo(dataObj, 
		(data) => {
			if(!data.notLogin) $('#nav-user-info-footer').append('<span class="split-line"></span><div class="box-shadow hover-warning" id="nav-user-out" class="box-shadow"><div>退出登录</div><h3></h3></div>');
		},
		false);
		
	} else {
		userInfo.upDataInfo_DOM();
	}
}


getUserInfo();

$(function() {
	/*******************顶部导航栏 搜索框 部分***********************/
	
	//顶部导航栏 搜索框 焦点事件
	$('#search').focus(function() {
		$(this).css('width', '180px');
		$(this).next('input').css('width', '70px');
		$(this).parent().css('margin-left', '20px');
	})

	$('#search').blur(function() {
		$(this).css('width', '');
		$(this).next('input').css('width', '');
		$(this).parent().css('margin-left', '');
	})

	
	/*******************顶部导航栏 头像  部分***********************/
	
	//顶部导航栏 头像部分 鼠标移入移出事件：
	var display_timer = -1;
	$('#head-portrait').mouseenter(() => {
		if(display_timer != -1) {
			clearTimeout(display_timer);
			display_timer = -1;
		}
		$('#head-portrait').css('height', '70px').css('width', '70px').css('border-color', '#ffffff');
		$('#head-portrait-box').css('display', 'block');
		//浏览器反应延时， 定时器等待一下
		setTimeout(() => {
			$('#head-portrait-box').css('opacity', '1').css('top', '50px');
		}, 10);
	})


	$('#head-3 li:first-child').mouseleave(() => {
		$('#head-portrait').css('height', '').css('width', '').css('border-color', '');
		$('#head-portrait-box').css('opacity', '').css('top', '');
		if(display_timer != -1) {
			clearTimeout(display_timer);
			display_timer = -1;
		}
		display_timer = setTimeout(() => {
			$('#head-portrait-box').css('display', '');
			display_timer = -1;
		}, 300);
	})

	//顶部导航栏 头像部分 子项点击事件部分：
	var funArr = [null, null, null, userInfo.outLogin];
	$('#nav-user-info-footer>div').each(function (index) {
		if(!funArr[index]) return;
		$(this).click(funArr[index]);
	})

	//顶部导航栏 头像子项 事件函数：
	function outLogin() {
		$.removeCookie('userInfo');
		userInfo.outLogin(()=> {
			window.location.reload();
		});
	}



	/*******************顶部导航栏 用户组件 事件部分***********************/
	
	//定时器数组部分
	var nav_userInfo_array = $('#head-3>ul>li');
	var nav_userInfo_timer_arr = [];
	nav_userInfo_timer_arr.length = nav_userInfo_array.length;
	nav_userInfo_timer_arr.fill(-1);
	nav_userInfo_array.each(function (num) {
		if(num == 0) return;
		$(this).mouseenter(() => {
			let k = nav_userInfo_array.index(this);
			if(nav_userInfo_timer_arr[k] != -1) {
				clearTimeout(nav_userInfo_timer_arr[k]);
				nav_userInfo_timer_arr[k] = -1;
			}
			else $(this).children('ul').css('display', '');
			setTimeout(() => {
				$(this).children('ul').css('opacity', '1').css('top', '70px');
			}, 10);
		});
		$(this).mouseleave(() => {
			let k = nav_userInfo_array.index(this);
			$(this).children('ul').css('opacity', '').css('top', '');
			if(nav_userInfo_timer_arr[k] != -1) {
				clearTimeout(nav_userInfo_timer_arr[k]);
				nav_userInfo_timer_arr[k] = -1;
			}
			nav_userInfo_timer_arr[k] = setTimeout(() => {
				$(this).children('ul').css('display', 'none');
				nav_userInfo_timer_arr[k] = -1;
			}, 300);
		})
		
	});
	
	
	
	var fooler = document.querySelector('#footer-2');
	var dynamic_fooler = new simulationTyping(fooler, '<span>&nbsp;</span>');
	dynamic_fooler.change('Copyright © 2021-2022 网络2003何祥斌制作', 100);
	setInterval(()=> {
		dynamic_fooler.change('Copyright © 2021-2022 网络2003何祥斌制作', 100);
	}, 30000);

	
})




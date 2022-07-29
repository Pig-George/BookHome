//模拟打字会话类

export class simulationTyping {
	dir;
	timer;
	Obj;
	delSpeed;
	endStr;
	constructor(obj, end_str, del_speed) {
		this.timer = -1;
		this.dir = 0;
		this.Obj = obj;
		this.delSpeed = del_speed ? del_speed : 50;
		this.endStr = end_str;
	}
	
	addChar = function (str, delay) {
		let tmp = '';
		// console.log(delay);
		this.timer = setInterval(() => {
			tmp = str.slice(0, this.dir) + (str[this.dir] === ' ' ? '&nbsp;' : str[this.dir]);
			++(this.dir);
			this.Obj.innerHTML = tmp + this.endStr;
			if(this.dir == str.length) {
				clearInterval(this.timer);
				this.timer = -1;
			}
		}, delay);
	};
	
	
	change = function (str, delay) {
		if(delay === undefined) delay = 150;
		var tmp = '';
		if(this.timer != -1) {
			clearInterval(this.timer);
		}
		if(this.dir) {
			tmp = this.Obj.innerHTML;
			tmp = tmp.slice(0, tmp.length - this.endStr.length);
			// console.log(tmp);
			this.timer = setInterval(() => {
				if(tmp.endsWith('&nbsp;')) {
					tmp = tmp.substr(0, tmp.lastIndexOf('&nbsp;'));
				} else tmp = tmp.slice(0, tmp.length - 2);
				this.Obj.innerHTML = tmp + this.endStr;
				if(tmp.length == 0) {
					clearInterval(this.timer);
					this.dir = 0;
					this.addChar(str, delay);
				}
			}, this.delSpeed);
		} else {
			this.addChar(str, delay);
		}
	}
}


//request_url :string 请求地址    echo_obj :object  动态会话对象
export function UserInfo(request_url, echo_obj) {
		
		this.url = request_url;
		this.echoObj = echo_obj;
		
		//初始化DOM用户信息
		this.upDataInfo_DOM = function (upDataObj, afterFun) {
			if(upDataObj === undefined) upDataObj = {};
			if(Object.prototype.toString.call(upDataObj) !== '[object Object]') return;
			this.getInfo(upDataObj, this.setInfo, undefined, afterFun);
		};
		
		
		/***********************写入cookie接口：***********************/
		//写入cookie    key:string     data:Obj    is_reset:bool
		this.setCookie = (key, data, is_reset = false) => {
			if((!is_reset) && ($.cookie(key) !== undefined)) {
				let old_data = JSON.parse($.cookie(key));
				for(let k in data) {
					old_data[k] = data[k];
				}
				data = old_data;
			}
			data = JSON.stringify(data);
			$.cookie(key, data);
		}

		
		
		
		/***********************请求用户数据接口：***********************/
		//succCallFun(data): 请求成功的回调函数
		//errCallFun(): 请求失败的回调函数
		//getDataObj: 需要请求的数据   如：请求 uname和uSign ->  {uname:"", uSign:""}  不传则默认请求所有
		this.getInfo = (getDataObj, succCallFun, errCallFun, afterFun) => {
			if((Object.keys(getDataObj)).length == 0 || getDataObj === undefined) {
				getDataObj = {};
				getDataObj.isAll = true;
			}
			getDataObj.mode = 1;
			$.get(this.url, getDataObj, (data, target) => {this.call_back(data, target, succCallFun, errCallFun, afterFun);});
		};
		
		/***********************将 用户数据 写入到 HTML 接口***********************/
		this.setInfo = (data, afterFun, is_updateHeadPortraitSrc = true) => {
			if(data.notLogin) {
				if($.cookie('userInfo') !== undefined) $.removeCookie('userInfo');
				$('[class=user-name]').text('未登录');
			}
			else {
				if(data.uname !== undefined) $('[class=user-name]').text(data.uname);
				if(data.uHeadPortraitSrc !== undefined) {
					if(is_updateHeadPortraitSrc) {
						data.uHeadPortraitSrc = data.uHeadPortraitSrc + '?' + Date.now();	//保证img标签刷新，传一个时间戳参数
					}
					$('[class=head-portrait-img]').attr('src', data.uHeadPortraitSrc);
				}
				if(data.uIP !== undefined) $('[class=user-IP]').text('IP：' + data.uIP);
				if(data.uSign !== undefined) $('[class=user-sign]').val(data.uSign).text(data.uSign);
				this.setCookie('userInfo', data);
			}
			if(afterFun) afterFun(data);
		};
		
		/***********************改变 用户数据 接口***********************/
		this.changeInfo = (changeData, succCallFun, errCallFun) => {
			if(Object.prototype.toString.call(changeData) !== '[object Object]') return;
			changeData.mode = 0;
			$.get(this.url, changeData, (data, target) => {this.call_back(data, target, succCallFun, errCallFun);});
		};
		
		this.outLogin = (Obj, succCallFun) => {
			console.log(succCallFun);
			if(succCallFun === undefined) {
				console.log(1);
				succCallFun = () => {
					window.location.reload();
				}
			}
			$.removeCookie('userInfo');
			var data = {mode:-1};
			$.get(this.url, data, (data, target) => {this.call_back(data, target, succCallFun)});
		}
		
		//ajax方法的回调接口
		this.call_back = (data, target, succCallFun, errCallFun, afterFun) => {
			if(target === "success") {
				console.log(data);
				let now_data = JSON.parse(data);
				if(now_data.echo_data && this.echoObj) this.echoObj.change(now_data.echo_data);
				if(now_data.is_succeed && succCallFun) succCallFun(now_data.user_data, afterFun);
				else if((!now_data.is_succeed) && errCallFun) errCallFun();
			} else {
				console.log('request_error!');
			}
		};
	}
	



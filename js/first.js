window.addEventListener('load', function() {
	var arrow_l = document.querySelector('#arrow-l');
	var arrow_r = document.querySelector('#arrow-r');
	var body_3 = document.querySelector('#body-3');
	var ul = body_3.querySelector('ul');
	var ol = document.querySelector('ol');
	var imgWidth = body_3.offsetWidth;
	
	
	//鼠标悬浮停止轮播	
	body_3.addEventListener('mouseenter', function() {		
		arrow_l.style.opacity = '1';
		arrow_l.style.left = 0;
		arrow_r.style.opacity = '1';
		arrow_r.style.right = 0;
		clearInterval(timer);
		timer = null;
	})
	
	
	//鼠标离开继续轮播
	body_3.addEventListener('mouseleave', function() {
		arrow_l.style.opacity = '0';
		arrow_l.style.left = -arrow_l.offsetWidth + 'px';
		arrow_r.style.opacity = '0';
		arrow_r.style.right = -arrow_r.offsetWidth + 'px';
		timer = setInterval(function() {
			arrow_r.click();
		}, 4000);
	})

	
	for (var i = 0; i < ul.children.length; i++) {
		var li = document.createElement('li');
		ol.appendChild(li);
	}
	var ol_li = ol.querySelectorAll('li');
	for (var i = 0; i < ol.children.length; i++) {
		var a = document.createElement('a');
		ol_li[i].setAttribute('index', i);
		ol_li[i].appendChild(a);
		ol_li[i].addEventListener('click', function() {
			for (var i = 0; i < ol.children.length; i++) {
				ol_li[i].querySelector('a').className = '';
			}
			this.querySelector('a').className = 'designate';
			var index = this.getAttribute('index');
			num = circle = index;
			animate(ul, -index * imgWidth);
		})
	}
	ol_li[0].querySelector('a').className = 'designate';
	var first = ul.children[0].cloneNode(true);
	ul.appendChild(first);
	var num = 0;
	var circle = 0;
	
	
	//右轮播按钮点击事件
	arrow_r.addEventListener('click', function() {
		if (num == ul.children.length - 1) {
			ul.style.left = 0;
			num = 0;
		}
		num++;
		animate(ul, -imgWidth * num);
		circle++;
		if (circle == ol.children.length) {
			circle = 0;
		}
		for (var i = 0; i < ol.children.length; i++) {
			ol_li[i].querySelector('a').className = '';
		}
		ol_li[circle].querySelector('a').className = 'designate';
	});
	
	
	//左轮播按钮点击事件
	arrow_l.addEventListener('click', function() {
		if (num == 0) {
			num = ul.children.length - 1;
			ul.style.left = -num * imgWidth + 'px';
		}
		num--;
		animate(ul, -imgWidth * num);
		circle--;
		if (circle < 0) {
			circle = ol.children.length - 1;
		}
		for (var i = 0; i < ol.children.length; i++) {
			ol_li[i].querySelector('a').className = '';
		}
		ol_li[circle].querySelector('a').className = 'designate';
	});
	var olWidth = ol.children.length * ol_li[0].offsetWidth;
	ol.style.left = imgWidth / 2 - olWidth / 2 + 'px';
	
	
	
	//进入页面 启动轮播
	var timer = setInterval(function() {
		arrow_r.click();
	}, 4000);
})





//轮播动画函数
function animate(obj, target, callback) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var step = (target - obj.offsetLeft) / 10;
		step = step > 0 ? Math.ceil(step) : Math.floor(step);
		if (obj.offsetLeft == target) {
			clearInterval(obj.timer);
			if (callback) {
				callback();
			}
		}
		obj.style.left = obj.offsetLeft + step + 'px';
	}, 15);

}

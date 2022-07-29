<?php

namespace EmailHtml {
function getAuthCodeHtml($authCode, $timer) {
return <<<EOF
<!DOCTYPE html>
<html>
    <head>
	    <base target="_blank" />
	    <meta charset="utf-8">
	    <style type="text/css">::-webkit-scrollbar{ display: none; }</style>
	    <style id="cloudAttachStyle" type="text/css">#divNeteaseBigAttach, #divNeteaseBigAttach_bak{divheader,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}blockquote{margin-right:0px}</style>
    </head>
    <body tabindex="0" role="listitem">
	<table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
	    <tbody>
		<tr>
		    <td>
			<div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
			    <table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;">
				<tbody>
				    <tr>
					<td width="210"></td>
				    </tr>
				</tbody>
			    </table>
			</div>
			<div style="width:680px;padding:0 10px;margin:0 auto;">
			    <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
				<strong style="display:block;margin-bottom:15px;">尊敬的用户：<span style="color:#f60;font-size: 16px;"></span>您好！</strong><strong style="display:block;margin-bottom:15px;">欢迎您<span style="color: red">注册</span>书坊，请在验证码输入框中输入：<span style="color:#f60;font-size: 24px">{$authCode}</span>，以完成操作。</strong><br>
				<strong style="display:block;margin-bottom:15px;">验证码在<span style="color: red">{$timer}分钟内</span>有效</span>
			    </div>
			    <div style="margin-bottom:30px;">
			    <small style="display:block;margin-bottom:20px;font-size:12px;">
				<p style="color:#747474;">注意：此操作将会绑定邮箱。如非本人操作，请忽略本邮件</p>
			    </small>
			    </div>
			</div>
			<div style="width:700px;margin:0 auto;">
			    <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
				<p>此为系统邮件，请勿回复<br>
				请保管好您的邮箱，避免账号被他人盗用
				</p>
			    <p>书坊</p>
			    </div>
			</div>
		    </td>
		</tr>
	    </tbody>
	</table>
    </body>
</html>
EOF;
}


function getForgetPwdHtml($uname, $url, $timer) {
    return <<<EOF
<!DOCTYPE html>
<html>
	<head>
		<base target="_blank" />
		<meta charset="utf-8">
		<style type="text/css">::-webkit-scrollbar{ display: none; }</style>
		<style id="cloudAttachStyle" type="text/css">#divNeteaseBigAttach, #divNeteaseBigAttach_bak{divheader,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}blockquote{margin-right:0px}</style>
	</head>
	<body tabindex="0" role="listitem">
		<table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
		<tbody>
			<tr>
			<td>
				<div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
				<table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;">
					<tbody>
					<tr>
						<td width="210"></td>
					</tr>
					</tbody>
				</table>
				</div>
				<div style="width:680px;padding:0 10px;margin:0 auto;">
				<div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
					<strong style="display:block;margin-bottom:15px;">尊敬的<span style="color:#f60;font-size: 16px;">{$uname}</span>：您好！</strong>
					<strong style="display:block;margin-bottom:15px;">您正在进行<span style="color: red">修改密码</span>操作，<a style="color:#f60;font-size: 20px" href="{$url}">点击此处修改密码</a></strong><br>
					<strong style="display:block;margin-bottom:15px;">此链接在<span style="color: red">{$timer}分钟内</span>内有效</span>
				</div>
				<div style="margin-bottom:30px;">
				<small style="display:block;margin-bottom:20px;font-size:12px;">
					<p style="color:#747474;">注意：如非本人操作，请忽略本邮件</p>
				</small>
				</div>
				</div>
				<div style="width:700px;margin:0 auto;">
				<div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
					<p>此为系统邮件，请勿回复<br>
					请保管好您的邮箱，避免账号被他人盗用
					</p>
				<p>书坊</p>
				</div>
				</div>
			</td>
			</tr>
		</tbody>
		</table>
	</body>
</html>


EOF;
}
}
?>

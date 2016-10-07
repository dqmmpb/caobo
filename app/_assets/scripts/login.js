'use strict';

//下拉刷新 上拉加载
$(document).on('pageInit', '#page-login', function(e, id, page) {

  var args = Arg.parse(location.href);
  var redirectUrl = Arg('redirectUrl');

  if(redirectUrl)
    redirectUrl = Base64.decode(redirectUrl);

  function initLogin() {

    $('form.login').attr('action', $.Cfg.api.services.auth.login);

    $('form.login').ajaxForm({
      type: $.Cfg.api.type,
      beforeSubmit: function(arr, $form, options) {
        var email = $form.find('input[name="email"]').val();
        var name = $form.find('input[name="name"]').val();

        if($.Cfg.config.RegExp.email.test(email) && $.Cfg.config.RegExp.name.test(name)) {
          var preloader = $.showPreloader('正在登录');
          $(preloader).addClass('modal-preloader');
          return true;
        } else{
          if(!$.Cfg.config.RegExp.email.test(email)) {
            $.alert('请输入正确的邮箱');
          } else if($.Cfg.config.RegExp.name.test(name)) {
            $.alert('请输入正确的姓名');
          }
          return false;
        }
      },
      success: function(respData, xhr) {
        var loginToken = respData.token;
        $.Cfg.setTokenStore(loginToken);
        $.Cfg.setTokenCookie(loginToken);
        if(redirectUrl)
          location.href = redirectUrl;
      },
      error: function(xhr, status, error) {
        console.log(xhr);
      }
    });
  }

  function validateToken() {
    var token = $.Cfg.getTokenStore();

    if(!token) {
      if($.detect.app.wechat) {
        token = $.Cfg.getTokenCookie();
        $.Cfg.setTokenStore(token);
      }
    } else {
      location.href = 'index.html';
    }
  }

  initLogin();
  validateToken();

});


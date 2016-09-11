'use strict';

//下拉刷新 上拉加载
$(document).on('pageInit', '#page-index', function(e, id, page) {

  $.modal.prototype.defaults.closePrevious = false;

  var args = Arg.parse(location.href);
  var activityId = Arg('state');

  var loading = false, end = false;

  function loadError(message){
    var $content = $(page).find('.content');
    var $wrapper = $($content).find('.content-wrapper');
    var tpl = $(page).find('#tpl-error').html();
    var compiledTpl = $.t7.compile(tpl);
    var data = {
      message: message
    };
    // 生成新条目的HTML
    var html_data = compiledTpl({data: data});

    var $html_data = $(html_data);

    $wrapper.html($html_data);

    $.pullToRefreshDone($content);
    // 重置加载flag
    loading = false;

  }

  function getUserInfo(userId, data) {
    if(userId) {
      if(data instanceof Array) {
        for(var i = 0; i < data.length; i++) {
          if(userId === '' + data[i].id) {
            return data[i];
          }
        }
      } else if(data instanceof Object) {
        if(userId === '' + data.id) {
          return data;
        }
      }
    }
  }

  function initModal(data, append) {
    var tpl = $(page).find('#tpl-modal').html();
    var compiledTpl = $.t7.compile(tpl);
    var html_data = compiledTpl({data: data});

    var modal = $.modal({
      afterText: html_data
    });

    $(modal).addClass('modal-info');
    $('.modal-overlay').addClass('modal-info-overlay');

    $(modal).find('.close').click(function() {
      $.closeModal(modal);
      $('.modal-overlay').removeClass('modal-info-overlay');
    });
  }

  function initActivity(data, append) {

    var $content = $(page).find('.content');
    var $wrapper = $($content).find('.content-wrapper');
    var tpl = $(page).find('#tpl-activity').html();
    var compiledTpl = $.t7.compile(tpl);
    var html_data = compiledTpl({data: data});
    var $html_data = $(html_data);

    if(append) {
      $html_data.appendTo($wrapper);
    } else
      $wrapper.html($html_data);

    $content.find('.avatar').each(function(){
      $(this).click(function() {
        var userId = $(this).data('user-id');
        var userInfo = getUserInfo(userId, data.user_info);
        if(userInfo)
          initModal(userInfo);
        else
          $.alert('暂无该用户信息');
      });
    });

  }

  function initSwiper(data, append) {
    var $content = $(page).find('.bar-footer-secondary-swiper');
    var tpl = $(page).find('#tpl-swiper').html();
    var compiledTpl = $.t7.compile(tpl);
    var html_data = compiledTpl({data: data});
    var $html_data = $(html_data);

    if(append) {
      $html_data.appendTo($content);
    } else
      $content.html($html_data);

    $('.swiper-container').swiper({
      slidesPerView: 8,
      paginationClickable: true,
      spaceBetween: 0,
      freeMode: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      breakpoints: {
        414: {
          slidesPerView: 8,
          spaceBetween: 0
        },
        375: {
          slidesPerView: 7,
          spaceBetween: 0
        },
        320: {
          slidesPerView: 6,
          spaceBetween: 0
        }
      }
    });

    $content.find('.avatar').each(function(){
      $(this).click(function() {
        var userId = $(this).data('user-id');
        var userInfo = getUserInfo(userId, data.invitors);
        if(userInfo)
          initModal(userInfo);
        else
          $.alert('暂无该用户信息');
      });
    });
  }


  function initHeader() {

    var $content = $(page).find('.content');

    var $barHeader = $(page).find('.bar-footer');
    if($barHeader.length === 0) {
      $barHeader = $('<header class="bar bar-nav"></header>');
      $barHeader.insertBefore($($content));
    }

    $barHeader.html($('<h1 class="title">我要投票</h1><a id="logout" class="icon fa fa-fw fa-sign-out external pull-right" href="javascript:void(0)" external alt="退出"></a>'));
    $('#logout').click(function() {
      $.Cfg.removeTokenStore();
      $.Cfg.removeTokenCookie();
      location.href = Arg.url($.Cfg.config.html.login, args);
    });
  }

  function initFooter(data, append) {
    var $content = $(page).find('.content');

    var $barFooter = $(page).find('.bar-footer');
    if($barFooter.length === 0) {
      $barFooter = $('<footer class="bar bar-footer"></footer>');
      $barFooter.insertBefore($($content));
    }

    if(data.archieved)
      $barFooter.html($('<a class="button button-block button-fill button-primary button-next disabled">投票结束</a>'));
    else
      $barFooter.html($('<a id="vote" class="button button-block button-fill button-primary button-next">投票</a>'));

    if(!data.hide_results) {
      var $barFooterS = $(page).find('.footer-secondary');
      if($barFooterS.length === 0) {
        $barFooterS = $('<div class="bar bar-footer-secondary bar-footer-secondary-swiper"></div>');
        $barFooterS.insertBefore($($barFooter));
      }

      initSwiper(data, append);
    }

    $('#vote').click(function() {
      var allChecked = $content.find('input[name="my-vote"]:checked');
      var item_ids = [];
      for(var i = 0; i < allChecked.length; i++){
        item_ids.push($(allChecked[i]).val());
      }
      console.log(item_ids);


      var token = $.Cfg.getTokenStore();

      if(activityId) {
        var params = {
          code: activityId,
          item_ids: item_ids
        };

        $.ajax({
          url: $.Cfg.api.services.activities.vote,
          type: 'POST',
          headers: {
            'X-Jwt': token
          },
          data: params,
          timeout: $.Cfg.config.timeout,
          success: function (respData, status) {
            $.alert('投票成功');
            location.reload();
          },
          error: function(xhr, status, errorThrown) {
            if(status === 'error') {
              loadError(xhr.responseJSON.error);
            } else if (status === 'timeout') {
              loadError('网络异常，请刷新重试');
            } else {
              loadError('未知错误，请刷新重试');
            }
          }
        });
      } else {
        loadError('活动链接已失效');
      }

    });
  }

  function initBar(data, append) {
    initHeader();
    initFooter(data, append);
  }

  function loadData(append, refresh){

    var token = $.Cfg.getTokenStore();

    if(activityId) {

      var $content = $(page).find('.content');

      var params = {
        code: activityId
      };

      $.ajax({
        url: $.Cfg.api.services.activities.info,
        type: 'GET',
        headers: {
          'X-Jwt': token
        },
        data: params,
        timeout: $.Cfg.config.timeout,
        success: function (data, status) {
          if (data) {

            initBar(data, append);
            initActivity(data, append);

            if (refresh) {
              $.pullToRefreshDone($content);
            } else {
              // 重置加载flag
              loading = false;
            }
          } else {
            initHeader();
            loadError('数据加载有误，请刷新重试');
          }
        },
        error: function(xhr, status, errorThrown) {
          if(status === 'error') {
            initHeader();
            loadError(xhr.responseJSON.error);
          } else if (status === 'timeout') {
            initHeader();
            loadError('网络异常，请刷新重试');
          } else {
            initHeader();
            loadError('未知错误，请刷新重试');
          }
        },
        complete: function (xhr, status) {
          // 重置加载flag
          loading = false;
        }
      });

    } else {

      initHeader();
      loadError('活动链接已失效');
    }

  }

  function pullToRefreshAction() {

    var $content = $(page).find('.content');

    $content.on('refresh', function() {

      // 如果正在加载，则退出
      if (loading) {
        return;
      }

      end = false;
      // 设置flag
      loading = true;

      loadData(false, true);

    });
  }

  function init() {
    // 设置flag
    loading = true;
    loadData(false, false);
    pullToRefreshAction();

  }

  function initLogin() {
    var tpl = $(page).find('#tpl-login').html();
    var compiledTpl = $.t7.compile(tpl);
    var html_data = compiledTpl({});

    var modal = $.modalLogin({
      afterText: html_data
    });

    $('.modal-login form.login').attr('action', $.Cfg.api.services.auth.login);

    $('.modal-login form.login').ajaxForm({
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
        $.hidePreloader();
        $.closeModalLogin(modal);
        init();
      },
      error: function(xhr, status, error) {
        console.log(xhr);
        $.hidePreloader();
      }
    });
  }

  function validateToken() {
    var token = $.Cfg.getTokenStore();

    if(!token) {
      if($.detect.app.wechat) {
        token = $.Cfg.getTokenCookie();
        $.Cfg.setTokenStore(token);
        init();
      } else {
        initLogin();
      }
    } else {
      init();
    }
  }

  validateToken();

});


'use strict';

//下拉刷新 上拉加载
$(document).on('pageInit', '#page-index', function(e, id, page) {

  var activityId = $.Cfg.getActivityId(location.href);
  activityId = 1;

  var loading = false, end = false;

  function loadError(message){
    var $content = $(page).find('.content');
    var $wrapper = $($content).find('.content-wrapper');
    var tpl = $(page).find('#tpl-error').html();
    var data = {
      message: message
    };
    // 生成新条目的HTML
    var html_data = template(tpl, {data: data});
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
    var html_data = template(tpl, {data: data});

    var modal = $.modal({
      afterText: html_data,
      buttons: []
    });

    $(modal).find('.close').click(function() {
      $.closeModal(modal);
    });
  }

  function initActivity(data, append) {

    var $content = $(page).find('.content');
    var $wrapper = $($content).find('.content-wrapper');
    var tpl = $(page).find('#tpl-activity').html();

    // 生成新条目的HTML
    var html_data = template(tpl, {data: data});
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
    // 生成新条目的HTML
    var html_data = template(tpl, {data: data});
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

  function initBar(data, append) {

    var $content = $(page).find('.content');

    var $barFooter = $(page).find('.bar-footer');
    if($barFooter.length == 0) {
      $barFooter = $('<footer class="bar bar-footer"></footer>');
      $barFooter.insertBefore($($content));
    }

    if(data.archieved)
      $barFooter.html($('<a class="button button-block button-fill button-primary button-next disabled">投票结束</a>'));
    else
      $barFooter.html($('<a class="button button-block button-fill button-primary button-next">投票</a>'));

    if(!data.hide_results) {
      var $barFooterS = $(page).find('.footer-secondary');
      if($barFooterS.length == 0) {
        $barFooterS = $('<div class="bar bar-footer-secondary bar-footer-secondary-swiper"></div>');
        $barFooterS.insertBefore($($barFooter));
      }

      initSwiper(data, append);
    }

  }

  function loadData(append, refresh){

    if(activityId) {

      var $content = $(page).find('.content');

      var params = {
        'open_id': 'xaaafdasfasdlkfjl...',
        'email': 'a@b.com',
        'name': 'Tom'
      };

      $.ajax({
        url: $.Cfg.api.services.activities.info,
        data: JSON.stringify(params),
        type: 'GET',
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
            loadError('数据加载有误，请刷新重试');
          }
        },
        error: function(xhr, status, errorThrown) {
          if (status === 'timeout') {
            loadError('网络异常，请刷新重试');
          }
        },
        complete: function (xhr, status) {
          // 重置加载flag
          loading = false;
        }
      });

    } else {

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

  init();


});


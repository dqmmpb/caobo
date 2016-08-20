'use strict';

//下拉刷新 上拉加载
$(document).on('pageInit', '#page-index', function(e, id, page) {

  var loading = false, end = false;

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
  }


  function loadData(append, refresh){
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
      success: function(respData, status) {
        if(respData) {
          initActivity(respData, append);
          initSwiper(respData, append);

          if(refresh) {
            $.pullToRefreshDone($content);
          } else {
            // 重置加载flag
            loading = false;
          }
        }
      },
      complete: function(xhr, status) {
        if(status === 'timeout') {
          $.toast('网络异常，请重试');
        }
        // 重置加载flag
        loading = false;
      }
    });

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


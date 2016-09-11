(function($){
  'use strict';

  $.Cfg = (function(){

    function Cfg() {
      var local = false;
      this.config = {
        local: local,
        server: 'http://' + location.host,
        timeout: 10000,
        path: '',
        token: 'token',
        RegExp: {
          email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
          name: /\w+/
        },
        html: {
          login: 'index.html'
        }
      };
      this.api = {
        services: {
          auth: {
            login: this.config.server + '/ajax/login.json'
          },
          user: {
            info: this.config.server + '/ajax/userinfo.json'
          },
          activities: {
            info: this.config.server + '/ajax/activities.json',
            vote: this.config.server + '/ajax/vote.json'
          }
        }
      };

      if(!local) {
        $.extend(true, this.config, {
          server: 'https://' + 'cctech.site'
        });
        $.extend(true, this.api, {
          services: {
            auth: {
              login: this.config.server + '/v1/participators'
            },
            user: {
              info: this.config.server + '/v1/participators'
            },
            activities: {
              info: this.config.server + '/v1/activities/info',
              vote: this.config.server + '/v1/vote'
            }
          }
        });
      }
    }

    Cfg.prototype.getTokenStore = function() {
      return store.get($.Cfg.config.token);
    };

    Cfg.prototype.setTokenStore = function(token) {
      return store.set($.Cfg.config.token, token);
    };

    Cfg.prototype.removeTokenStore = function() {
      return store.remove($.Cfg.config.token);
    };

    Cfg.prototype.setTokenCookie = function(token) {
      return Cookies.set($.Cfg.config.token, token);
    };

    Cfg.prototype.getTokenCookie = function(params) {
      return Cookies.get($.Cfg.config.token);
    };

    Cfg.prototype.removeTokenCookie = function() {
      return Cookies.remove($.Cfg.config.token);
    };
/*
    Cfg.prototype.stringify = function(obj, keyPrefix) {
      if(typeof obj === 'object') {
        var segs = [];
        var thisKey;
        for (var key in obj) {
          if (!obj.hasOwnProperty(key)) continue;
          var val = obj[key];

          if (typeof key === 'undefined' || key.length === 0 || typeof val === 'undefined' || val === null || val.length === 0) continue;

          thisKey = keyPrefix ? keyPrefix + '.' + key : key;

          if (typeof obj.length !== 'undefined') {
            thisKey = keyPrefix ? keyPrefix + '[' + key + ']' : key;
          }

          if (typeof val === 'object') {
            segs.push(this.stringify(val, thisKey));
          } else {
            segs.push(thisKey + '=' + val);
          }
        }
        return segs.join('&');
      }
      return obj;
    };

    Cfg.prototype.generateSortParams = function (params) {
      var keys = Object.keys(params);
      var sortKeys = keys.sort();

      var paramsSort = {};
      for(var i = 0; i < sortKeys.length; i++) {
        paramsSort[sortKeys[i]] = params[sortKeys[i]];
      }

      return this.stringify(paramsSort);
    };

    Cfg.prototype.generateSign = function(params, token, skey) {
      var sortParams = this.generateSortParams(params);
      var vkey = $.md5(sortParams + skey.substring(0, 10));
      return vkey + token;
    };

    Cfg.prototype.prepareParams = function (params, sign, token, skey) {
      var preParams = Object.clone(params, true);
      if(sign) {
        if(typeof token === 'string' && typeof skey === 'string')
          preParams.params.sign = this.generateSign(preParams.params, token, skey);
        else
          throw 'Token or skey invalid';
      }

      return preParams;
    };*/

    return new Cfg();

  })();

})(jQuery);

(function($) {
  'use strict';

  $.modalLogin = function (params) {

    var _modalTemplateTempDiv = document.createElement('div');

    params = params || {};
    var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
    var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
    var afterTextHTML = params.afterText ? params.afterText : '';
    var modalHTML = '<div class="modal-login modal-no-buttons"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div></div>';

    _modalTemplateTempDiv.innerHTML = modalHTML;

    var modal = $(_modalTemplateTempDiv).children();

    $(document.body).append(modal[0]);

    $.openModalLogin(modal);
    return modal[0];
  };

  $.openModalLogin = function (modal) {
    $.closeModal();
    $.closeModalLogin();
    modal = $(modal);
    var isModal = modal.hasClass('modal-login');
    if (isModal) {
      modal.show();
      modal.css({
        marginTop: -Math.round(modal.outerHeight() / 2) + 'px'
      });
    }

    var overlay;

    if ($('.modal-login-overlay').length === 0) {
      $(document.body).append('<div class="modal-login-overlay"></div>');
    }

    overlay = $('.modal-login-overlay');

    //Make sure that styles are applied, trigger relayout;
    var clientLeft = modal[0].clientLeft;

    // Trugger open event
    modal.trigger('open');

    // Classes for transition in
    overlay.addClass('modal-overlay-visible');
    modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
      if (modal.hasClass('modal-out')) modal.trigger('closed');
      else modal.trigger('opened');
    });
    return true;
  };

  $.closeModalLogin = function (modal) {
    modal = $(modal || '.modal-in');
    if (typeof modal !== 'undefined' && modal.length === 0) {
      return;
    }
    var isModal = modal.hasClass('modal-login');

    var removeOnClose = modal.hasClass('remove-on-close');

    var overlay = $('.modal-login-overlay');
    overlay.removeClass('modal-overlay-visible');

    modal.trigger('close');

    modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
      if (modal.hasClass('modal-out')) modal.trigger('closed');
      else modal.trigger('opened');
      modal.remove();
    });

    return true;
  };

})(jQuery);

(function($){
  'use strict';

  $.Cfg = (function(){

    function Cfg() {
      this.config = {
       // server: 'http://' + location.host,
        server: 'https://' + '192.168.1.10',
        timeout: 10000,
        path: '',
        token: 'cctech_token'
      };
      this.api = {
        services: {
          auth: {
            login: this.config.server + '/ajax/login.json'
          },
          user: {
            //token: this.config.server + '/ajax/token.json'
            token: this.config.server + '/v1/participators'
          },
          activities: {
            //info: this.config.server + '/ajax/activities.json'
            info: this.config.server + '/v1/activities/09684d94b28b0316'
          }
        }
      };
    }

    Cfg.prototype.getActivityId = function(path) {
      var activityId = url('?activityid', path);
      if(activityId)
        return activityId;
    };

    Cfg.prototype.getTokenStore = function() {
      return store.get('cctech_token');
    };

    Cfg.prototype.setTokenStore = function(token) {
      return store.set('cctech_token', token);
    };

    Cfg.prototype.getToken = function(params) {
      var thiz = this, token;
      //token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwaXJlZF9hdCI6IjIwMTYtMDktMjdUMDI6MjQ6MTQrMDA6MDAifQ.YxpPW4Uyxg6eKCsyrJIWX-exNT09eaTFjdPUokiCAuI';
      $.ajax({
        url: $.Cfg.api.services.user.token,
        data: params,
        type: 'POST',
        async: false,
        timeout: $.Cfg.config.timeout,
        success: function (data, status) {
          if (data) {
            token = thiz.setTokenStore(data.token);
          } else {
            $.alert('数据加载有误，请刷新重试');
          }
        },
        error: function(xhr, status, errorThrown) {
          if(status === 'error') {
            $.alert(xhr.responseJSON.error);
          } else if (status === 'timeout') {
            $.alert('网络异常，请刷新重试');
          } else {
            $.alert('未知错误，请刷新重试');
          }
        },
        complete: function (xhr, status) {

        }
      });
      return token;
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

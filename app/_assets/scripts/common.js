(function($){
  'use strict';

  $.Cfg = (function(){

    function Cfg() {
      this.config = {
        server: 'http://' + location.host,
        timeout: 10000,
        path: '',
        icons: {
          amap: {
            default: 'assets/images/xm-ic-amap-marker.png',
            click: 'assets/images/xm-ic-amap-marker-click.png'
          }
        }
      };

      this.api = {
        services: {
          auth: {
            login: this.config.server + '/washcar/home'
          },
          activities: {
            info: this.config.server + '/ajax/activities.json'
          }
        }
      };
    }
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

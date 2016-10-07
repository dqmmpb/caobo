(function($){
  'use strict';

  $.Cfg = (function(){

    function Cfg() {
      var local = true;
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
        type: 'GET',
        services: {
          auth: {
            login: this.config.server + '/ajax/login.json'
          },
          user: {
            info: this.config.server + '/ajax/userinfo.json'
          },
          activities: {
            info: this.config.server + '/ajax/activities.json',
            vote: this.config.server + '/ajax/vote.json',
            matches: this.config.server + '/ajax/matches.json'
          }
        }
      };

      if(!local) {
        $.extend(true, this.config, {
          server: 'https://' + 'cctech.site'
        });
        $.extend(true, this.api, {
          type: 'POST',
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

    return new Cfg();

  })();

})(jQuery);

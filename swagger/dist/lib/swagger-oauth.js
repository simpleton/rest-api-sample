var appName;
var popupMask;
var popupDialog;
var clientId;
var realm;
var redirect_uri;
var clientSecret;
var scopeSeparator;
var additionalQueryStringParams;

function handleLogin(***REMOVED*** {
  var scopes = [];

  var auths = window.swaggerUi.api.authSchemes || window.swaggerUi.api.securityDe***REMOVED***nitions;
  if(auths***REMOVED*** {
    var key;
    var defs = auths;
    for(key in defs***REMOVED*** {
      var auth = defs[key];
      if(auth.type === 'oauth2' && auth.scopes***REMOVED*** {
        var scope;
        if(Array.isArray(auth.scopes***REMOVED******REMOVED*** {
          // 1.2 support
          var i;
          for(i = 0; i < auth.scopes.length; i++***REMOVED*** {
            scopes.push(auth.scopes[i]***REMOVED***;
          }
        }
        ***REMOVED*** {
          // 2.0 support
          for(scope in auth.scopes***REMOVED*** {
            scopes.push({scope: scope, description: auth.scopes[scope], OAuthSchemeKey: key}***REMOVED***;
          }
        }
      }
    }
  }

  if(window.swaggerUi.api
    && window.swaggerUi.api.info***REMOVED*** {
    appName = window.swaggerUi.api.info.title;
  }

  $('.api-popup-dialog'***REMOVED***.remove(***REMOVED***; 
  popupDialog = $(
    [
      '<div class="api-popup-dialog">',
      '<div class="api-popup-title">Select OAuth2.0 Scopes</div>',
      '<div class="api-popup-content">',
        '<p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.',
          '<a href="#">Learn how to use</a>',
        '</p>',
        '<p><strong>' + appName + '</strong> API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>',
        '<ul class="api-popup-scopes">',
        '</ul>',
        '<p class="error-msg"></p>',
        '<div class="api-popup-actions"><button class="api-popup-authbtn api-button green" type="button">Authorize</button><button class="api-popup-cancel api-button gray" type="button">Cancel</button></div>',
      '</div>',
      '</div>'].join(''***REMOVED******REMOVED***;
  $(document.body***REMOVED***.append(popupDialog***REMOVED***;

  //TODO: only display applicable scopes (will need to pass them into handleLogin***REMOVED***
  popup = popupDialog.***REMOVED***nd('ul.api-popup-scopes'***REMOVED***.empty(***REMOVED***;
  for (i = 0; i < scopes.length; i ++***REMOVED*** {
    scope = scopes[i];
    str = '<li><input type="checkbox" id="scope_' + i + '" scope="' + scope.scope + '"' +'" oauthtype="' + scope.OAuthSchemeKey +'"/>' + '<label for="scope_' + i + '">' + scope.scope ;
    if (scope.description***REMOVED*** {
      if ($.map(auths, function(n, i***REMOVED*** { return i; }***REMOVED***.length > 1***REMOVED*** //if we have more than one scheme, display schemes
	    str += '<br/><span class="api-scope-desc">' + scope.description + ' ('+ scope.OAuthSchemeKey+'***REMOVED***' +'</span>';
	  ***REMOVED***
	    str += '<br/><span class="api-scope-desc">' + scope.description + '</span>';
    }
    str += '</label></li>';
    popup.append(str***REMOVED***;
  }

  var $win = $(window***REMOVED***,
    dw = $win.width(***REMOVED***,
    dh = $win.height(***REMOVED***,
    st = $win.scrollTop(***REMOVED***,
    dlgWd = popupDialog.outerWidth(***REMOVED***,
    dlgHt = popupDialog.outerHeight(***REMOVED***,
    top = (dh -dlgHt***REMOVED***/2 + st,
    left = (dw - dlgWd***REMOVED***/2;

  popupDialog.css({
    top: (top < 0? 0 : top***REMOVED*** + 'px',
    left: (left < 0? 0 : left***REMOVED*** + 'px'
  }***REMOVED***;

  popupDialog.***REMOVED***nd('button.api-popup-cancel'***REMOVED***.click(function(***REMOVED*** {
    popupMask.hide(***REMOVED***;
    popupDialog.hide(***REMOVED***;
    popupDialog.empty(***REMOVED***;
    popupDialog = [];
  }***REMOVED***;

  $('button.api-popup-authbtn'***REMOVED***.unbind(***REMOVED***;
  popupDialog.***REMOVED***nd('button.api-popup-authbtn'***REMOVED***.click(function(***REMOVED*** {
    popupMask.hide(***REMOVED***;
    popupDialog.hide(***REMOVED***;

    var authSchemes = window.swaggerUi.api.authSchemes;
    var host = window.location;
    var pathname = location.pathname.substring(0, location.pathname.lastIndexOf("/"***REMOVED******REMOVED***;
    var defaultRedirectUrl = host.protocol + '//' + host.host + pathname + '/o2c.html';
    var redirectUrl = window.oAuthRedirectUrl || defaultRedirectUrl;
    var url = null;
    var scopes = []
    var o = popup.***REMOVED***nd('input:checked'***REMOVED***; 
    var OAuthSchemeKeys = [];
    var state;
    for(k =0; k < o.length; k++***REMOVED*** {
      var scope = $(o[k]***REMOVED***.attr('scope'***REMOVED***;
      if (scopes.indexOf(scope***REMOVED*** === -1***REMOVED***
        scopes.push(scope***REMOVED***;
      var OAuthSchemeKey = $(o[k]***REMOVED***.attr('oauthtype'***REMOVED***;      
      if (OAuthSchemeKeys.indexOf(OAuthSchemeKey***REMOVED*** === -1***REMOVED***
          OAuthSchemeKeys.push(OAuthSchemeKey***REMOVED***;
    }
    
    //TODO: merge not replace if scheme is different from any existing 
    //(needs to be aware of schemes to do so correctly***REMOVED***
    window.enabledScopes=scopes;    
    
    for (var key in authSchemes***REMOVED*** { 
      if (authSchemes.hasOwnProperty(key***REMOVED*** && OAuthSchemeKeys.indexOf(key***REMOVED*** != -1***REMOVED*** { //only look at keys that match this scope.
        var flow = authSchemes[key].flow;

        if(authSchemes[key].type === 'oauth2' && flow && (flow === 'implicit' || flow === 'accessCode'***REMOVED******REMOVED*** {
          var dets = authSchemes[key];
          url = dets.authorizationUrl + '?response_type=' + (flow === 'implicit' ? 'token' : 'code'***REMOVED***;
          window.swaggerUi.tokenName = dets.tokenName || 'access_token';
          window.swaggerUi.tokenUrl = (flow === 'accessCode' ? dets.tokenUrl : null***REMOVED***;
          state = key;
        }
        ***REMOVED*** if(authSchemes[key].type === 'oauth2' && flow && (flow === 'application'***REMOVED******REMOVED*** {
            var dets = authSchemes[key];
            window.swaggerUi.tokenName = dets.tokenName || 'access_token';
            clientCredentialsFlow(scopes, dets.tokenUrl, key***REMOVED***;
            return;
        }        
        ***REMOVED*** if(authSchemes[key].grantTypes***REMOVED*** {
          // 1.2 support
          var o = authSchemes[key].grantTypes;
          for(var t in o***REMOVED*** {
            if(o.hasOwnProperty(t***REMOVED*** && t === 'implicit'***REMOVED*** {
              var dets = o[t];
              var ep = dets.loginEndpoint.url;
              url = dets.loginEndpoint.url + '?response_type=token';
              window.swaggerUi.tokenName = dets.tokenName;
            }
            ***REMOVED*** if (o.hasOwnProperty(t***REMOVED*** && t === 'accessCode'***REMOVED*** {
              var dets = o[t];
              var ep = dets.tokenRequestEndpoint.url;
              url = dets.tokenRequestEndpoint.url + '?response_type=code';
              window.swaggerUi.tokenName = dets.tokenName;
            }
          }
        }
      }
    }

    redirect_uri = redirectUrl;

    url += '&redirect_uri=' + encodeURIComponent(redirectUrl***REMOVED***;
    url += '&realm=' + encodeURIComponent(realm***REMOVED***;
    url += '&client_id=' + encodeURIComponent(clientId***REMOVED***;
    url += '&scope=' + encodeURIComponent(scopes.join(scopeSeparator***REMOVED******REMOVED***;
    url += '&state=' + encodeURIComponent(state***REMOVED***;
    for (var key in additionalQueryStringParams***REMOVED*** {
        url += '&' + key + '=' + encodeURIComponent(additionalQueryStringParams[key]***REMOVED***;
    }

    window.open(url***REMOVED***;
  }***REMOVED***;

  popupMask.show(***REMOVED***;
  popupDialog.show(***REMOVED***;
  return;
}


function handleLogout(***REMOVED*** {
  for(key in window.swaggerUi.api.clientAuthorizations.authz***REMOVED***{
    window.swaggerUi.api.clientAuthorizations.remove(key***REMOVED***
  }
  window.enabledScopes = null;
  $('.api-ic.ic-on'***REMOVED***.addClass('ic-off'***REMOVED***;
  $('.api-ic.ic-on'***REMOVED***.removeClass('ic-on'***REMOVED***;

  // set the info box
  $('.api-ic.ic-warning'***REMOVED***.addClass('ic-error'***REMOVED***;
  $('.api-ic.ic-warning'***REMOVED***.removeClass('ic-warning'***REMOVED***;
}

function initOAuth(opts***REMOVED*** {
  var o = (opts||{}***REMOVED***;
  var errors = [];

  appName = (o.appName||errors.push('missing appName'***REMOVED******REMOVED***;
  popupMask = (o.popupMask||$('#api-common-mask'***REMOVED******REMOVED***;
  popupDialog = (o.popupDialog||$('.api-popup-dialog'***REMOVED******REMOVED***;
  clientId = (o.clientId||errors.push('missing client id'***REMOVED******REMOVED***;
  clientSecret = (o.clientSecret||null***REMOVED***;
  realm = (o.realm||errors.push('missing realm'***REMOVED******REMOVED***;
  scopeSeparator = (o.scopeSeparator||' '***REMOVED***;
  additionalQueryStringParams = (o.additionalQueryStringParams||{}***REMOVED***;

  if(errors.length > 0***REMOVED***{
    log('auth unable initialize oauth: ' + errors***REMOVED***;
    return;
  }

  $('pre code'***REMOVED***.each(function(i, e***REMOVED*** {hljs.highlightBlock(e***REMOVED***}***REMOVED***;
  $('.api-ic'***REMOVED***.unbind(***REMOVED***;
  $('.api-ic'***REMOVED***.click(function(s***REMOVED*** {
    if($(s.target***REMOVED***.hasClass('ic-off'***REMOVED******REMOVED***
      handleLogin(***REMOVED***;
    ***REMOVED*** {
      handleLogout(***REMOVED***;
    }
    false;
  }***REMOVED***;
}

function clientCredentialsFlow(scopes, tokenUrl, OAuthSchemeKey***REMOVED*** {
    var params = {
      'client_id': clientId,
      'client_secret': clientSecret,
      'scope': scopes.join(' '***REMOVED***,
      'grant_type': 'client_credentials'
    }
    $.ajax(
    {
      url : tokenUrl,
      type: "POST",
      data: params,
      success:function(data, textStatus, jqXHR***REMOVED***
      {
        onOAuthComplete(data,OAuthSchemeKey***REMOVED***;
      },
      error: function(jqXHR, textStatus, errorThrown***REMOVED***
      {
        onOAuthComplete(""***REMOVED***;
      }
    }***REMOVED***;
    
  }

window.processOAuthCode = function processOAuthCode(data***REMOVED*** {
  var OAuthSchemeKey = data.state;
  var params = {
    'client_id': clientId,
    'code': data.code,
    'grant_type': 'authorization_code',
    'redirect_uri': redirect_uri
  };

  if (clientSecret***REMOVED*** {
    params.client_secret = clientSecret;
  }

  $.ajax(
  {
    url : window.swaggerUi.tokenUrl,
    type: "POST",
    data: params,
    success:function(data, textStatus, jqXHR***REMOVED***
    {
      onOAuthComplete(data, OAuthSchemeKey***REMOVED***;
    },
    error: function(jqXHR, textStatus, errorThrown***REMOVED***
    {
      onOAuthComplete(""***REMOVED***;
    }
  }***REMOVED***;
};

window.onOAuthComplete = function onOAuthComplete(token,OAuthSchemeKey***REMOVED*** {
  if(token***REMOVED*** {
    if(token.error***REMOVED*** {
      var checkbox = $('input[type=checkbox],.secured'***REMOVED***
      checkbox.each(function(pos***REMOVED***{
        checkbox[pos].checked = false;
      }***REMOVED***;
      alert(token.error***REMOVED***;
    }
    ***REMOVED*** {
      var b = token[window.swaggerUi.tokenName];      
      if (!OAuthSchemeKey***REMOVED***{
          OAuthSchemeKey = token.state;
      }
      if(b***REMOVED***{
        // if all roles are satis***REMOVED***ed
        var o = null;
        $.each($('.auth .api-ic .api_information_panel'***REMOVED***, function(k, v***REMOVED*** { 
          var children = v;
          if(children && children.childNodes***REMOVED*** {
            var requiredScopes = [];
            $.each((children.childNodes***REMOVED***, function (k1, v1***REMOVED***{
              var inner = v1.innerHTML;
              if(inner***REMOVED***
                requiredScopes.push(inner***REMOVED***;
            }***REMOVED***;
            var diff = [];
            for(var i=0; i < requiredScopes.length; i++***REMOVED*** {
              var s = requiredScopes[i];
              if(window.enabledScopes && window.enabledScopes.indexOf(s***REMOVED*** == -1***REMOVED*** {
                diff.push(s***REMOVED***;
              }
            }
            if(diff.length > 0***REMOVED***{
              o = v.parentNode.parentNode;
              $(o.parentNode***REMOVED***.***REMOVED***nd('.api-ic.ic-on'***REMOVED***.addClass('ic-off'***REMOVED***;
              $(o.parentNode***REMOVED***.***REMOVED***nd('.api-ic.ic-on'***REMOVED***.removeClass('ic-on'***REMOVED***;

              // sorry, not all scopes are satis***REMOVED***ed
              $(o***REMOVED***.***REMOVED***nd('.api-ic'***REMOVED***.addClass('ic-warning'***REMOVED***;
              $(o***REMOVED***.***REMOVED***nd('.api-ic'***REMOVED***.removeClass('ic-error'***REMOVED***;
            }
            ***REMOVED*** {
              o = v.parentNode.parentNode;
              $(o.parentNode***REMOVED***.***REMOVED***nd('.api-ic.ic-off'***REMOVED***.addClass('ic-on'***REMOVED***;
              $(o.parentNode***REMOVED***.***REMOVED***nd('.api-ic.ic-off'***REMOVED***.removeClass('ic-off'***REMOVED***;

              // all scopes are satis***REMOVED***ed
              $(o***REMOVED***.***REMOVED***nd('.api-ic'***REMOVED***.addClass('ic-info'***REMOVED***;
              $(o***REMOVED***.***REMOVED***nd('.api-ic'***REMOVED***.removeClass('ic-warning'***REMOVED***;
              $(o***REMOVED***.***REMOVED***nd('.api-ic'***REMOVED***.removeClass('ic-error'***REMOVED***;
            }
          }
        }***REMOVED***;
        window.swaggerUi.api.clientAuthorizations.add(OAuthSchemeKey, new SwaggerClient.ApiKeyAuthorization('Authorization', 'Bearer ' + b, 'header'***REMOVED******REMOVED***;
      }
    }
  }
};

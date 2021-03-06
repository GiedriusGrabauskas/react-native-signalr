let signalRHubConnectionFunc;
let oldLogger = window.console.debug;

if (!window.addEventListener) {
  window.addEventListener = window.addEventListener = () => {};
}
window.navigator.userAgent = "react-native";
window.jQuery = require('./lib/signalr-jquery-polyfill.js');

module.exports = {
  setLogger: (logger) => {
    if (window.console && window.console.debug) {
      window.console.debug("OVERWRITING CONSOLE.DEBUG in react-native-signalr");
    } else {
      if (!window.console) {
        window.console = {};
      }
    }
    window.console.debug = logger;
  },
  hubConnection: (serverUrl, options) => {
    window.document = window.document || {
      readyState: 'complete'
    };
    if (!signalRHubConnectionFunc) {
      require('ms-signalr-client');
      signalRHubConnectionFunc = window.jQuery.hubConnection;
    }
    const protocol = serverUrl.split('//')[0];
    const host = serverUrl.split('//')[1];
    window.location = {
      protocol: protocol,
      host: host
    };
    window.document = {
      createElement: function() {
        return {
          protocol: protocol,
          host: host
        }
      }
    };

    if (options && options.headers) {
      window.jQuery.defaultAjaxHeaders = options.headers;
    }

    return signalRHubConnectionFunc(serverUrl, options);
  }
};

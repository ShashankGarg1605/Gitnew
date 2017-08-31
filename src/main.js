/* global window document f7 */

import 'babel-polyfill';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

// Import F7
/* eslint-disable no-unused-vars */
import Framework7 from 'framework7';

import Framework7Vue from 'framework7-vue';
import Routes from './routes';
import App from './App';
import VeeValidate from 'vee-validate';
import VueResource from 'vue-resource';
import moment from 'moment';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

import FilterDateRange from './components/FilterDateRange';

// Set up some useful globals
window.isMaterial = !window.Framework7.prototype.device.ios;
window.isiOS = window.Framework7.prototype.device.ios;

// force use of Material design throughout
window.isMaterial = true;
window.isiOS = false;

// Import F7 iOS Theme Styles
/* eslint-disable global-require */
if (window.isiOS) {
  const Framework7Theme =
    require('framework7/dist/css/framework7.ios.min.css');
  const Framework7ThemeColors =
    require('framework7/dist/css/framework7.ios.colors.min.css');
} else {
  /* OR for Material Theme: */
  const Framework7ThemeMaterial =
    require('framework7/dist/css/framework7.material.min.css');
  const Framework7ThemeColorsMaterial =
    require('framework7/dist/css/framework7.material.colors.min.css');
}


Vue.use(Framework7Vue);
Vue.use(VeeValidate);
Vue.use(VueResource);

// add the moment library to the Vue prototype so we can use it from any template directly
Vue.prototype.moment = moment;

// register font-awesome as a global component
Vue.component('icon', Icon);


// Vue.config.errorHandler = function (err, vm, info) {
//   console.log('info: ', info);
//   console.log('vm: ', vm);
//   console.log('err: ', err);
// };

// if (!('toJSON' in Error.prototype)) {
//   Object.defineProperty(Error.prototype, 'toJSON', {
//     value: function () {
//       var alt = {};

//       Object.getOwnPropertyNames(this).forEach(function (key) {
//         alt[key] = this[key];
//       }, this);

//       return alt;
//     },
//     configurable: true,
//     writable: true
//   });
// }

window.onunhandledrejection = function (e) {
  throw e;
};

window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.log('columnNo: ', columnNo);
  console.log('lineNo: ', lineNo);
  console.log('url: ', url);
  console.log('msg: ', msg);
  console.log('error: ', error);
  // window.vm.$http.post('fakeurl', {
  //   msg: msg,
  //   error: JSON.stringify(error)
  // });
  return false;
};


// Init App
window.vm = new Vue({ // eslint-disable-line no-new
  el: '#app',
  template: '<app />',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    swipePanel: 'left',
    routes: Routes,
    material: window.isMaterial,
    animateNavBackIcon: window.isiOS,
    pushState: true,
    pushStateNoAnimation: true,
    panelLeftBreakpoint: 960,
    swipePanelActiveArea: 10,
    swipePanelNoFollow: true,
    cache: false,
    cacheDuration: 0,
    hideNavbarOnPageScroll: true
  },
  http: {
    headers: {
      'Content-type': 'application/json;charset=UTF-8; charset=UTF-8',
      'source': '3',
      'Authorization': (() => window.localStorage.authToken)(),
      'tenant': (() => window.localStorage.tenantData && ('tenant_' + JSON.parse(window.localStorage.tenantData).id))()
    }
  },
  // Register App Component
  components: {
    app: App
  }
});

Vue.component('pz-filter-date-range', FilterDateRange);


// hide the side menu on the login page
window.vm.$f7.onPageBeforeInit('*', function (page) {
  // if we have created a cycle of pages, remove the pages in between
  // for eg. Q-A-X-Y-Z-A, then on opening this last A, it will become Q-A
  var his = window.vm.$f7.mainView.history;
  var idx = his.findIndex(page => page === his[his.length - 1]);
  if (idx >= 0) his.splice(idx, his.length - idx - 1);
  window.vm.$f7.params.swipePanel = page.name === 'login' ? false : 'left';
});


var BackButton = 0;
function handleBackButton() {
  // NOTE: The back button will behave differently depending on circumstance
  // If the side panel is open, close it
  if (document.querySelector('.panel-left.active')) {
    // This will do nothing when the split-view is open
    return window.f7.closePanel();
  }
  // Close modals
  // @TODO How to handle modals we shouldn't close like a login-screen?
  if (document.querySelector('.modal-in')) {
    return f7.closeModal();
  }
  // If we have a back button, we want it to go back
  if (window.vm.$f7.mainView.history.length > 1) {
    return window.vm.$f7.mainView.router.back();
  } else if (BackButton === 0) {
    BackButton++;
    window.vm.$f7.addNotification({ message: 'Press again to exit', hold: 2000 });
    setTimeout(() => { BackButton = 0; }, 2000);
  } else return window.navigator.app.exitApp();
}


// Ye olde Device Ready
document.addEventListener('deviceready', () => {
  // Bind to the back button for Android
  document.addEventListener('backbutton', handleBackButton);
});

window._pz = {};
window._pz.err = {
  'ERR_NET': 'Please check your internet connection and try again.',
  'ERR_CREDS': 'You have entered an incorrect username and/or password',
  'ERR_404': 'No results found'
};

window._pz.errFunc = function (err) {
  var errMsg;
  if (err.status === 404) errMsg = window._pz.err.ERR_404;
  else if (err.status === 0) errMsg = window._pz.err.ERR_NET;
  else errMsg = `Uh oh! Something went wrong (Error ${err.status})`;
  return errMsg;
};


window._pz.utils = {};
















// RANDOM GIBBERISH CAUGHT WHILE LEARNING VUEJS

// solutn for i18n by exposing a new Vue instance containing global translation data. Best part is that its reactive.
// changing message1 in the console will update the view!
// https://stackoverflow.com/questions/43193409/global-data-with-vuejs-2/43193455?noredirect=1#comment78773970_43193455
// var pzTranslation = new Vue({ data: { message1: 'my global message' } });
// pzTranslation.install = function () {
//   Object.defineProperty(Vue.prototype, '$pzTranslation', {
//     get: function () { return pzTranslation; },
//     set: function (newValue) { pzTranslation = newValue; }
//   });
// };
// Vue.use(pzTranslation);
// -----------------------


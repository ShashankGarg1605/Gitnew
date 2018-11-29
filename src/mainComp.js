import Vue from 'vue';
import Framework7Vue from 'framework7-vue';
import Icon from 'vue-awesome/components/Icon';
import App from './App';
import Routes from './routes';

import 'vue-awesome/icons';
import VeeValidate from 'vee-validate';
import VueResource from 'vue-resource';
import moment from 'moment';

Vue.use(Framework7Vue);
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.component('icon', Icon);
Vue.prototype.moment = moment;

export default new Vue({ // eslint-disable-line no-new
    el: '#app',
    template: '<app />',
    // Init Framework7 by passing parameters here
    framework7: {
        root: '#app',
        swipePanel: 'left',
        routes: Routes,
        material: true,
        pushState: true,
        pushStateNoAnimation: true,
        panelLeftBreakpoint: 960,
        swipePanelActiveArea: 20,
        swipePanelNoFollow: true,
        cache: false,
        hideNavbarOnPageScroll: true,
        cacheDuration: 0
    },
    http: {
        headers: {
            'Content-type': 'application/json;charset=UTF-8; charset=UTF-8',
            'source': '3',
            'Authorization': (() => window.localStorage.authToken)(),
            'ID': (() => window.localStorage.userID)(),
            'tenant': (() => window.localStorage.tenantData && ('tenant_' + JSON.parse(window.localStorage.tenantData).id))(),
            'isRM': (() => window.localStorage.isRM)()
        }
    },
    // Register App Component
    components: {
        app: App
    }
});
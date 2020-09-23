import Vue from 'vue';
import App from './App.vue';
import store from './store';
import PortalVue from 'portal-vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css';

Vue.use(PortalVue);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');

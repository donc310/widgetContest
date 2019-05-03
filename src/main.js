
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueCustomElement from 'vue-custom-element'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import WidgetComponent from './Widget'
Vue.config.devtools = true;
Vue.use(VueCustomElement)
Vue.use(BootstrapVue)
Vue.customElement('widget-app', WidgetComponent)

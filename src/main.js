
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueCustomElement from 'vue-custom-element'
import * as VueGoogleMaps from 'vue2-google-maps'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import WidgetComponent from './Widget'
Vue.config.devtools = true;
window.EventBus = new Vue();
Vue.use(VueCustomElement)
Vue.use(BootstrapVue)
Vue.use(VueGoogleMaps,{
  load: {
    key: 'AIzaSyAyGGXVLIX9JpMcdt3qFb9YxACazz-KZV4',
    libraries: 'places',
    region: 'US',
   },
})
Vue.customElement('widget-app', WidgetComponent)

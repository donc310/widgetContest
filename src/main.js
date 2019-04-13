import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueCustomElement from 'vue-custom-element'
import * as VueGoogleMaps from 'vue2-google-maps'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(VueCustomElement)
Vue.use(BootstrapVue)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAyGGXVLIX9JpMcdt3qFb9YxACazz-KZV4',
    libraries: 'places',
    region: 'US',
   },
})
import WidgetComponent from './Widget'
Vue.customElement('widget-app', WidgetComponent)

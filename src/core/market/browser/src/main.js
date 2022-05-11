import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import App from './App.vue';
import router from './router.js';
import 'windi.css';
import { createPinia } from 'pinia';
window.eo=window.parent.eo;
createApp(App).use(router).use(Antd).use(createPinia()).mount('#app');

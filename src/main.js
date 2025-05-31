import axios from 'axios';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/main.css';
import router from './router/index.js';
axios.defaults.baseURL = process.env.VUE_APP_API_HOST || 'http://127.0.0.1:8000';

router.beforeEach((to, from, next) => {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.height = '';
  document.body.style.top = '';
  next();
});
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded')
})
router.afterEach(() => {
  window.scrollTo(0, 0);
  setTimeout(() => {
    document.body.style.overflow = '';
  }, 50);
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mixin({
  beforeUnmount() {
    document.body.style.overflow = '';
    document.body.style.position = '';
  }
});

app.mount('#app');
setInterval(() => {
  if (document.body.style.overflow === 'hidden') {
    console.log('Found stuck body style, resetting...');
    document.body.style.overflow = '';
    document.body.style.position = '';
  }
}, 2000);
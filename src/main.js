// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')


import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createYmaps } from 'vue-yandex-maps';
import App from './App.vue';


import '@/assets/scss/normalize.scss';
import '@/assets/scss/main.scss'

createApp(App)
    .use(createPinia())
    .use(createYmaps({
        apikey: '0db64c2c-27fb-4602-9f62-88e37d902183',
    }))
    .mount('#app');






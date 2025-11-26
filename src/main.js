
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
        // apikey: 'ea49c24c-e45b-4fca-b358-9f44f0375c53',
    }))
    .mount('#app');






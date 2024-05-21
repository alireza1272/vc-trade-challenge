import {createApp} from 'vue'
import './assets/styles/style.css'
import App from './App.vue'
import 'primevue/resources/themes/aura-light-green/theme.css';
import router from './router/index';
import {createPinia} from 'pinia';
import ProgressSpinner from 'primevue/progressspinner';
import PrimeVue from 'primevue/config';
import MultiSelect from 'primevue/multiselect';


createApp(App)
    .use(createPinia())
    .use(PrimeVue)
    .component('PMultiSelect', MultiSelect)
    .component('ProgressSpinner', ProgressSpinner)
    .use(router).mount('#app')

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.VUE_APP_API_URL': JSON.stringify(env.VUE_APP_API_URL)
        },
        plugins: [vue()],
    }
})

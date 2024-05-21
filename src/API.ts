import axios from 'axios';

const axiosAPI = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

// Request interceptor
axiosAPI.interceptors.request.use((config) => {
    // Add headers or modify the request config here
    // if (localStorage.getItem(STORAGE_CLOOPY_TOKEN)) {
    //     config.headers.Authorization = `Bearer ${localStorage.getItem(STORAGE_CLOOPY_TOKEN)}`;
    // }
    // if (Cookies.get('udid')) {
    //     config.headers['X-UDID'] = Cookies.get('udid');
    // }
    return config;
}, (error) => {
    // Handle request error
    return Promise.reject(error);
});

// Response interceptor
axiosAPI.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default axiosAPI;

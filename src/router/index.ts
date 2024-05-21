import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import UserSearch from '../pages/UserSearch.vue';
import Statistics from '../pages/Statistics.vue';
import TagManagement from '../pages/TagManagement.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'userSearchPage',
        component: UserSearch,
    },
    {
        path: '/statistics',
        name: 'statisticsPage',
        component: Statistics,
    },
    {
        path: '/tag-management',
        name: 'tagManagementPage',
        component: TagManagement,
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

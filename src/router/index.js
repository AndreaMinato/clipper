import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Clipper from '../views/Clipper.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/:catchAll(.*)',
    name: 'clipper',
    component: Clipper,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

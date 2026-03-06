import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SucursalesView from '../views/SucursalesView.vue'
import ProductosView from '../views/ProductosView.vue'
import DisenadorView from '../views/DisenadorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/servicios',name: 'servicios',component: () => import('../views/ServiciosView.vue')},
    { path: '/', name: 'home', component: HomeView },
    { path: '/sucursales', name: 'sucursales', component: SucursalesView },
    { path: '/productos', name: 'productos', component: ProductosView },
    { path: '/disenador', name: 'disenador', component: DisenadorView } // <-- Registramos la ruta
  ]
})

export default router
<script setup lang="ts">
import { ref, computed } from 'vue'
import productosData from '../data/productos.json'

const categorias = ref(['Todos', 'Vidrio', 'Herrajes'])
const categoriaActiva = ref('Todos')

const tituloSeccion = computed(() => {
  if (categoriaActiva.value === 'Vidrio') return 'Nuestra línea de vidrios arquitectónicos'
  if (categoriaActiva.value === 'Herrajes') return 'Herrajes y accesorios de alta calidad'
  return 'Nuestros Productos Líderes en la Industria'
})

const productos = ref(productosData)

const productosFiltrados = computed(() => {
  if (categoriaActiva.value === 'Todos') return productos.value
  return productos.value.filter(p => p.categoria === categoriaActiva.value)
})

// FUNCIÓN PARA CARGAR IMÁGENES DINÁMICAMENTE EN VITE
const getImageUrl = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}
</script>

<template>
  <div class="py-12 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-12 h-10 transition-all duration-300">
        <h2 class="text-3xl font-extrabold text-blue-900 tracking-tight">{{ tituloSeccion }}</h2>
      </div>

      <div class="flex space-x-4 mb-10 border-b border-slate-200 pb-4">
        <button 
          v-for="cat in categorias" 
          :key="cat"
          @click="categoriaActiva = cat"
          :class="[
            'px-5 py-2 rounded-full font-semibold transition text-sm tracking-wide',
            categoriaActiva === cat 
              ? 'bg-blue-900 text-white shadow-md' 
              : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="producto in productosFiltrados" 
          :key="producto.id"
          class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
        >
          <div class="h-40 flex items-center justify-center border-b border-slate-100 bg-white p-6">
            <img 
              v-if="producto.logo" 
              :src="getImageUrl(producto.logo)" 
              :alt="producto.nombre"
              class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          <div class="p-6 flex flex-col flex-grow bg-white">
            <h3 class="text-lg font-bold text-slate-900 mb-2">{{ producto.nombre }}</h3>
            <p class="text-sm text-slate-600 flex-grow leading-relaxed mb-6">{{ producto.desc }}</p>
            
            <a 
              :href="`https://wa.me/522299208830?text=Hola,%20quiero%20información%20sobre%20${producto.nombre}`" 
              target="_blank"
              class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition inline-flex items-center gap-2"
            >
              Conoce más <span class="text-lg leading-none">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
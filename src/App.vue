<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

// Estado para abrir/cerrar el menú
const isMenuOpen = ref(false)

// Función para cerrar el menú al hacer clic en un link
const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <header class="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          
          <div class="flex-shrink-0 font-bold text-3xl tracking-widest">
            <RouterLink to="/" class="text-white hover:text-blue-400 transition">
              VIXA
            </RouterLink>
          </div>

          <div class="flex md:hidden">
            <button @click="isMenuOpen = !isMenuOpen" type="button" class="text-slate-300 hover:text-white focus:outline-none">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav class="hidden md:flex items-center space-x-8">
            <RouterLink to="/" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-wide">Inicio</RouterLink>
            <RouterLink to="/productos" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-wide">Productos</RouterLink>
            <RouterLink to="/servicios" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-wide">Servicios</RouterLink>
            <RouterLink to="/sucursales" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-wide">Sucursales</RouterLink>
            <RouterLink to="/disenador" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition shadow-md">
              Diseña tu Espacio
            </RouterLink>
          </nav>
        </div>
      </div>

      <div v-show="isMenuOpen" class="md:hidden bg-slate-800 border-t border-slate-700">
        <div class="px-4 pt-4 pb-6 space-y-2">
          <RouterLink @click="isMenuOpen = false" to="/" class="block px-3 py-3 rounded-md text-base font-medium hover:bg-slate-700 transition">Inicio</RouterLink>
          <RouterLink @click="isMenuOpen = false" to="/productos" class="block px-3 py-3 rounded-md text-base font-medium hover:bg-slate-700 transition">Productos</RouterLink>
          <RouterLink @click="isMenuOpen = false" to="/servicios" class="block px-3 py-3 rounded-md text-base font-medium hover:bg-slate-700 transition">Servicios</RouterLink>
          <RouterLink @click="isMenuOpen = false" to="/sucursales" class="block px-3 py-3 rounded-md text-base font-medium hover:bg-slate-700 transition">Sucursales</RouterLink>
          <RouterLink @click="isMenuOpen = false" to="/disenador" class="block px-3 py-4 mt-4 bg-blue-600 rounded-md text-center text-base font-bold uppercase transition">
            Diseña tu Espacio
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <RouterView />
    </main>

    <footer class="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
      <p>&copy; 2026 VIXA - Vidrios y Procesos de Xalapa. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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

          <nav class="hidden md:flex items-center space-x-8">
            <RouterLink to="/" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-wide">Inicio</RouterLink>
            <RouterLink to="/productos" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-wide">Productos</RouterLink>
            <RouterLink to="/sucursales" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-wide">Sucursales</RouterLink>
            
            <RouterLink to="/disenador" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition shadow-md">
              Diseña tu Espacio
            </RouterLink>
          </nav>
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

<style>
/* Cualquier estilo extra que Tailwind no cubra puede ir aquí, 
   pero con Tailwind casi no usaremos esta sección */
</style>
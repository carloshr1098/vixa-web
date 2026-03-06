<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import EnviarCVView from './EnviarCVView.vue' // 👈 Importamos el componente que hicimos hace rato

const mostrarModalCV = ref(false) // 👈 Controla si el formulario se ve o no
</script>

<template>
  <div class="flex flex-col">
    <section class="bg-slate-800 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          El Poder del <span class="text-blue-400">Vidrio Templado</span>
        </h1>
        <p class="text-xl md:text-2xl text-slate-300 max-w-3xl mb-10">
          Fabricantes y procesadores de vidrio para proyectos residenciales, comerciales y corporativos de cualquier escala.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <RouterLink to="/productos" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-md transition shadow-lg text-lg text-center">
            Ver Catálogo
          </RouterLink>
          <RouterLink to="/sucursales" class="bg-transparent border-2 border-slate-400 hover:border-white hover:text-white text-slate-300 font-bold py-3 px-8 rounded-md transition text-lg text-center">
            Nuestras Sucursales
          </RouterLink>
        </div>
      </div>
    </section>

    <div class="py-20 bg-slate-900 text-white"> 
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"> 
          
          <div class="space-y-10"> 
            <div> 
              <h2 class="text-3xl font-extrabold text-white mb-8">Sobre Nosotros</h2> 
              <div class="pl-4 border-l-4 border-blue-500"> 
                <h3 class="text-xl font-bold text-blue-400 mb-2">Nuestra Misión</h3> 
                <p class="text-slate-300 leading-relaxed">Proveer soluciones arquitectónicas en vidrio de la más alta calidad...</p> 
              </div> 
            </div> 
            <div class="pl-4 border-l-4 border-blue-500"> 
              <h3 class="text-xl font-bold text-blue-400 mb-2">Nuestra Visión</h3> 
              <p class="text-slate-300 leading-relaxed">Ser la procesadora de vidrio líder...</p> 
            </div> 
          </div> 

          <div class="bg-slate-800 rounded-3xl border border-slate-700 text-center shadow-2xl overflow-hidden group"> 
            <div class="h-40 overflow-hidden border-b border-slate-700">
              <img src="@/assets/banner-unete.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90">
            </div>

            <div class="p-10">
              <h3 class="text-2xl font-bold text-white mb-4">Únete a nuestro equipo</h3> 
              <p class="text-slate-300 mb-8 leading-relaxed">Estamos en constante crecimiento y buscamos talento apasionado. Nuestra IA analizará tu CV al instante.</p> 

<button 
  type="button"
  @click.prevent="mostrarModalCV = true" 
  class="inline-block w-full py-4 rounded-xl font-bold text-slate-900 bg-blue-400 hover:bg-blue-300 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-400/30 cursor-pointer"
> 
  Enviarr mi Currículum 
</button>
            </div>
          </div> 
        </div> 
      </div> 
    </div>

    <div v-if="mostrarModalCV" class="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="mostrarModalCV = false"></div>
      
      <div class="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          @click="mostrarModalCV = false" 
          class="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-10 p-2"
        >
          <span class="text-2xl font-bold">✕</span>
        </button>
        
        <EnviarCVView /> 
      </div>
    </div>

  </div>
</template>
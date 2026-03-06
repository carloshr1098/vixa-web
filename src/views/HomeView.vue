<script setup lang="ts">
import { RouterLink } from 'vue-router'
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

    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900">Soluciones Integrales en Vidrio</h2>
          <p class="mt-4 text-lg text-slate-600">Controlamos todo el proceso para garantizar la calidad en tu obra.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div class="h-48 w-full overflow-hidden bg-slate-100">
              <img src="@/assets/produccion.png" alt="Capacidad de Producción VIXA" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 flex-grow">
              <h3 class="text-xl font-bold text-slate-900 mb-3">Capacidad de Producción</h3>
              <p class="text-slate-600 leading-relaxed">
                Transformamos el vidrio con precisión milimétrica. Desde vidrio templado de seguridad hasta control solar procesados a la medida.
              </p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div class="h-48 w-full overflow-hidden bg-slate-100">
              <img src="@/assets/herrajes.png" alt="Herrajes arquitectónicos VIXA" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 flex-grow">
              <h3 class="text-xl font-bold text-slate-900 mb-3">Herrajes y Accesorios</h3>
              <p class="text-slate-600 leading-relaxed">
                Ingeniería de vanguardia para tus sistemas de vidrio. Distribuimos líneas completas de marcas líderes como Bruken y Herralum.
              </p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div class="h-48 w-full overflow-hidden bg-slate-100">
              <img src="@/assets/logistica.png" alt="Logística VIXA" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 flex-grow">
              <h3 class="text-xl font-bold text-slate-900 mb-3">Logística Directa</h3>
              <p class="text-slate-600 leading-relaxed">
                Logística diseñada para el vidrio. Ofrecemos una solución de entrega profesional donde la puntualidad es nuestra prioridad absoluta.
              </p>
            </div>
          </div>

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
                <p class="text-slate-300 leading-relaxed">Proveer soluciones arquitectónicas en vidrio de la más alta calidad, superando las expectativas mediante tecnología de punta y servicio excepcional.</p> 
              </div> 
            </div> 
             
            <div class="pl-4 border-l-4 border-blue-500"> 
              <h3 class="text-xl font-bold text-blue-400 mb-2">Nuestra Visión</h3> 
              <p class="text-slate-300 leading-relaxed">Ser la procesadora de vidrio líder y el referente de innovación, calidad y confianza para la industria de la construcción regional.</p> 
            </div> 
          </div> 

          <div class="bg-slate-800 rounded-3xl border border-slate-700 text-center shadow-2xl overflow-hidden group"> 
            <div class="h-40 overflow-hidden border-b border-slate-700">
              <img src="@/assets/banner-unete.png" alt="Proceso VIXA" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90">
            </div>

            <div class="p-10">
              <h3 class="text-2xl font-bold text-white mb-4">Únete a nuestro equipo</h3> 
              <p class="text-slate-300 mb-8 leading-relaxed">Estamos en constante crecimiento y buscamos talento apasionado. Si quieres formar parte de la familia VIXA, queremos conocerte.</p> 

              <RouterLink to="/enviar-cv" class="inline-block w-full py-4 rounded-xl font-bold text-slate-900 bg-blue-400 hover:bg-blue-300 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-400/30"> 
                Enviar mi Currículum 
              </RouterLink> 
            </div>
          </div> 

        </div> 
      </div> 
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Lógica para el Modal (Pop-up)
const mostrarModal = ref(false)
const enviadoExitoso = ref(false)

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  puesto: 'Producción / Planta'
})

const enviarViaMailto = () => {
  if (!form.value.nombre || !form.value.email) {
    alert("Por favor, ingresa tu nombre y correo.")
    return
  }
  const correoDestino = "carloshr1098@gmail.com"
  const asunto = encodeURIComponent(`Postulación VIXA: ${form.value.puesto} - ${form.value.nombre}`)
  const cuerpo = encodeURIComponent(
    `Hola, equipo de Reclutamiento VIXA.\n\n` +
    `Deseo postularme para la vacante de: ${form.value.puesto}.\n\n` +
    `DATOS:\n- Nombre: ${form.value.nombre}\n- Email: ${form.value.email}\n- Teléfono: ${form.value.telefono}\n\n` +
    `No olvides adjuntar tu CV en PDF a este correo.`
  )
  
  window.location.href = `mailto:${correoDestino}?subject=${asunto}&body=${cuerpo}`
  enviadoExitoso.value = true
}
</script>

<template>
  <div class="flex flex-col relative">
    
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
              <img src="@/assets/produccion.png" alt="Producción VIXA" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 flex-grow">
              <h3 class="text-xl font-bold text-slate-900 mb-3">Capacidad de Producción</h3>
              <p class="text-slate-600 leading-relaxed">Transformamos el vidrio con precisión milimétrica. Desde vidrio templado de seguridad hasta control solar procesados a la medida.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div class="h-48 w-full overflow-hidden bg-slate-100">
              <img src="@/assets/herrajes.png" alt="Herrajes VIXA" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 flex-grow">
              <h3 class="text-xl font-bold text-slate-900 mb-3">Herrajes y Accesorios</h3>
              <p class="text-slate-600 leading-relaxed">Ingeniería de vanguardia para tus sistemas de vidrio. Distribuimos marcas líderes como Bruken y Herralum.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div class="h-48 w-full overflow-hidden bg-slate-100">
              <img src="@/assets/logistica.png" alt="Logística VIXA" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 flex-grow">
              <h3 class="text-xl font-bold text-slate-900 mb-3">Logística Directa</h3>
              <p class="text-slate-600 leading-relaxed">Logística diseñada para el vidrio. Ofrecemos puntualidad y el manejo cuidadoso de cada pieza como prioridad absoluta.</p>
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
              <div class="pl-4 border-l-4 border-blue-500 text-left"> 
                <h3 class="text-xl font-bold text-blue-400 mb-2">Nuestra Misión</h3> 
                <p class="text-slate-300 leading-relaxed">Proveer soluciones arquitectónicas en vidrio de la más alta calidad, superando las expectativas mediante tecnología de punta y servicio excepcional.</p> 
              </div> 
            </div> 
            <div class="pl-4 border-l-4 border-blue-500 text-left"> 
              <h3 class="text-xl font-bold text-blue-400 mb-2">Nuestra Visión</h3> 
              <p class="text-slate-300 leading-relaxed">Ser la procesadora de vidrio líder y el referente de innovación, calidad y confianza para la industria de la construcción.</p> 
            </div> 
          </div> 

          <div class="bg-slate-800 rounded-3xl border border-slate-700 text-center shadow-2xl overflow-hidden group"> 
            <div class="h-40 overflow-hidden border-b border-slate-700">
              <img src="@/assets/banner-unete.png" alt="Manufactura VIXA" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90">
            </div>
            <div class="p-10">
              <h3 class="text-2xl font-bold text-white mb-4">Únete a nuestro equipo</h3> 
              <p class="text-slate-300 mb-8 leading-relaxed">Buscamos talento apasionado por la calidad. Si quieres formar parte de la familia VIXA, queremos conocerte.</p> 
              <button @click="mostrarModal = true" class="inline-block w-full py-4 rounded-xl font-bold text-slate-900 bg-blue-400 hover:bg-blue-300 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-400/30"> 
                Enviar mi Currículum 
              </button> 
            </div>
          </div> 
        </div> 
      </div> 
    </div>

    <div v-if="mostrarModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-modal">
        
        <button @click="mostrarModal = false; enviadoExitoso = false" class="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 rounded-full transition-all duration-300 shadow-sm">
          ✕
        </button>

        <div class="bg-blue-800 p-8 text-white text-center">
          <h2 class="text-2xl font-black italic uppercase tracking-tighter">Bolsa de Trabajo VIXA</h2>
          <p class="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1">Envío vía Correo</p>
        </div>

        <div class="p-8">
          <div v-if="!enviadoExitoso" class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-2">
              <p class="text-[10px] text-blue-800 font-bold leading-tight">
                Instrucciones: Se abrirá tu correo personal. <span class="uppercase">No olvides adjuntar tu CV en PDF.</span>
              </p>
            </div>
            <div>
              <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Nombre Completo</label>
              <input v-model="form.nombre" type="text" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Email</label>
                <input v-model="form.email" type="email" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-medium" />
              </div>
              <div>
                <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
                <input v-model="form.telefono" type="tel" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-medium" />
              </div>
            </div>
            <div>
              <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Área de interés</label>
              <select v-model="form.puesto" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none appearance-none cursor-pointer text-slate-900 font-medium">
                <option>Producción / Planta</option>
                <option>Ventas y Atención</option>
                <option>Logística y Distribución</option>
                <option>Administración</option>
              </select>
            </div>
            <button @click="enviarViaMailto" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl uppercase italic tracking-widest transition-all shadow-lg active:scale-95">
              Generar Correo 📧
            </button>
          </div>

          <div v-else class="text-center py-10 space-y-4">
            <div class="text-6xl mb-2">📩</div>
            <h3 class="text-2xl font-black italic text-slate-900">¡CASI LISTO!</h3>
            <p class="text-slate-500 text-sm max-w-xs mx-auto">Asegúrate de <strong>adjuntar tu archivo</strong> y darle a "Enviar" en tu aplicación de correo.</p>
            <button @click="mostrarModal = false; enviadoExitoso = false" class="text-blue-600 font-bold text-xs uppercase underline">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo del Select */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

/* Animación del Modal */
.animate-modal {
  animation: modalScale 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalScale {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
<script setup lang="ts">
import { ref } from 'vue'

// Estado para abrir/cerrar el modal (el pop)
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
    alert("Por favor, llena tus datos.")
    return
  }
  const correoDestino = "carloshr1098@gmail.com"
  const asunto = encodeURIComponent(`Postulación VIXA: ${form.value.puesto} - ${form.value.nombre}`)
  const cuerpo = encodeURIComponent(`Nombre: ${form.value.nombre}\nEmail: ${form.value.email}\nTeléfono: ${form.value.telefono}\n\n(No olvides adjuntar tu CV)`)
  
  window.location.href = `mailto:${correoDestino}?subject=${asunto}&body=${cuerpo}`
  enviadoExitoso.value = true
}
</script>

<template>
  <div class="flex flex-col relative">
    
    <section class="bg-slate-800 text-white py-24 px-4 flex flex-col items-center text-center">
        <h1 class="text-5xl font-extrabold mb-6">El Poder del <span class="text-blue-400">Vidrio Templado</span></h1>
        <p class="text-xl text-slate-300 max-w-3xl mb-10">Fabricantes y procesadores de vidrio para proyectos residenciales y comerciales.</p>
    </section>

    <section class="py-20 bg-slate-900 text-white">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-10">
            <h2 class="text-3xl font-extrabold">Sobre Nosotros</h2>
            <p class="text-slate-300">Proveer soluciones arquitectónicas en vidrio de la más alta calidad...</p>
        </div>

        <div class="bg-slate-800 rounded-3xl border border-slate-700 p-10 text-center shadow-2xl">
          <h3 class="text-2xl font-bold mb-4">Únete a nuestro equipo</h3>
          <p class="text-slate-300 mb-8">Si quieres formar parte de la familia VIXA, queremos conocerte.</p>
          
          <button @click="mostrarModal = true" class="inline-block w-full py-4 rounded-xl font-bold text-slate-900 bg-blue-400 hover:bg-blue-300 transition-all shadow-lg shadow-blue-400/30">
            Enviar mi Currículum
          </button>
        </div>
      </div>
    </section>

    <div v-if="mostrarModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      
      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <button @click="mostrarModal = false" class="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-full transition-colors font-bold text-xl">
          ✕
        </button>

        <div class="bg-blue-800 p-6 text-white text-center">
          <h2 class="text-xl font-black italic uppercase tracking-tighter">Bolsa de Trabajo VIXA</h2>
        </div>

        <div class="p-8">
          <div v-if="!enviadoExitoso" class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase">Nombre Completo</label>
              <input v-model="form.nombre" type="text" class="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase">Email</label>
                <input v-model="form.email" type="email" class="w-full p-3 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase">Teléfono</label>
                <input v-model="form.telefono" type="tel" class="w-full p-3 bg-slate-50 border rounded-xl" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase">Área</label>
              <select v-model="form.puesto" class="w-full p-3 bg-slate-50 border rounded-xl appearance-none">
                <option>Producción / Planta</option>
                <option>Ventas y Atención</option>
                <option>Administración</option>
              </select>
            </div>
            <button @click="enviarViaMailto" class="w-full bg-blue-700 text-white font-black py-4 rounded-xl uppercase italic tracking-widest hover:bg-blue-800 transition-all">
              Generar Correo 📧
            </button>
          </div>

          <div v-else class="text-center py-8 space-y-4">
            <div class="text-5xl">📫</div>
            <h3 class="text-xl font-black italic">¡REVISA TU CORREO!</h3>
            <p class="text-slate-500 text-xs">Adjunta tu CV y dale a enviar en tu aplicación de correo.</p>
            <button @click="mostrarModal = false; enviadoExitoso = false" class="text-blue-600 font-bold text-[10px] uppercase underline">Cerrar ventana</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animación para el pop */
.animate-in {
  animation: modalIn 0.3s ease-out;
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
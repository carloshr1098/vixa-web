<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  puesto: 'Producción / Planta'
})

const enviadoExitoso = ref(false)

const enviarViaMailto = () => {
  if (!form.value.nombre || !form.value.email) {
    alert("Por favor, ingresa tu nombre y correo para preparar el envío.")
    return
  }

  const correoDestino = "carloshr1098@gmail.com" // 👈 Correo de RH de VIXA
  const asunto = encodeURIComponent(`Postulación VIXA: ${form.value.puesto} - ${form.value.nombre}`)
  
  const cuerpo = encodeURIComponent(
    `Hola, equipo de Reclutamiento VIXA.\n\n` +
    `Deseo postularme para la vacante de: ${form.value.puesto}.\n\n` +
    `MIS DATOS DE CONTACTO:\n` +
    `- Nombre: ${form.value.nombre}\n` +
    `- Correo: ${form.value.email}\n` +
    `- Teléfono: ${form.value.telefono}\n\n` +
    `ADJUNTO MI CV EN ESTE CORREO.\n\n` +
    `Quedo atento a su respuesta. Saludos.`
  )

  window.location.href = `mailto:${correoDestino}?subject=${asunto}&body=${cuerpo}`
  enviadoExitoso.value = true
}
</script>

<template>
  <div class="relative max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-4">
    
    <div class="bg-blue-800 p-8 text-white text-center">
      <h2 class="text-2xl font-black italic uppercase tracking-tighter">Bolsa de Trabajo VIXA</h2>
      <p class="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1">Postulación Directa</p>
    </div>

    <div class="p-8">
      <div v-if="!enviadoExitoso" class="space-y-5">
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="text-[11px] text-blue-800 font-medium">
            <span class="font-black uppercase">💡 Instrucciones:</span> Al dar clic en el botón, se abrirá tu aplicación de correo. <strong>No olvides adjuntar tu CV en PDF</strong> antes de enviarlo.
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Completo *</label>
            <input v-model="form.nombre" type="text" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all" placeholder="Tu nombre" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Correo Electrónico *</label>
              <input v-model="form.email" type="email" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" placeholder="tu@correo.com" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
              <input v-model="form.telefono" type="tel" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" placeholder="228..." />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Área de interés</label>
            <select v-model="form.puesto" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none appearance-none cursor-pointer font-medium">
              <option>Producción / Planta</option>
              <option>Ventas y Atención</option>
              <option>Logística y Distribución</option>
              <option>Administración</option>
            </select>
          </div>
        </div>

        <button 
          @click="enviarViaMailto" 
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 uppercase tracking-widest italic flex items-center justify-center gap-3 mt-4"
        >
          <span>Generar Correo</span>
          <span class="text-xl">📧</span>
        </button>
      </div>

      <div v-else class="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div class="text-6xl mb-4">📩</div>
        <h3 class="text-2xl font-black italic text-slate-900 uppercase">¡Todo listo!</h3>
        <p class="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
          Hemos preparado tu correo de postulación. Asegúrate de <strong>adjuntar tu archivo</strong> y darle a "Enviar" en tu aplicación de correo.
        </p>
        <button @click="enviadoExitoso = false" class="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline">
          Volver al formulario
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Flechita del select personalizada */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

/* Animaciones suaves */
.animate-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
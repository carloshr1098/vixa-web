<script setup lang="ts">
import { ref } from 'vue'

// Estado del formulario
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  puesto: 'Producción / Planta',
  archivoNombre: ''
})

const enviadoExitoso = ref(false)

// Solo guardamos el nombre para mostrarlo en la interfaz
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.archivoNombre = target.files[0].name
  }
}

const enviarViaMailto = () => {
  if (!form.value.nombre || !form.value.email) {
    alert("Por favor, ingresa al menos tu nombre y correo para preparar el envío.")
    return
  }

  // CONFIGURACIÓN DEL CORREO
  const correoDestino = "carloshr1098@gmail.com" // 👈 Pon aquí el correo de RH de VIXA
  const asunto = encodeURIComponent(`Postulación VIXA: ${form.value.puesto} - ${form.value.nombre}`)
  
  // Cuerpo del mensaje formateado
  const cuerpo = encodeURIComponent(
    `Hola, equipo de Reclutamiento VIXA.\n\n` +
    `Deseo postularme para la vacante de: ${form.value.puesto}.\n\n` +
    `MIS DATOS:\n` +
    `- Nombre: ${form.value.nombre}\n` +
    `- Correo de contacto: ${form.value.email}\n` +
    `- Teléfono: ${form.value.telefono}\n\n` +
    `IMPORTANTE: Adjunto mi CV en formato PDF a este correo electrónico.\n\n` +
    `Quedo atento a su respuesta. Saludos.`
  )

  // Crear el enlace mailto
  const mailtoLink = `mailto:${correoDestino}?subject=${asunto}&body=${cuerpo}`

  // Abrir el gestor de correo (Outlook, Gmail, Apple Mail, etc.)
  window.location.href = mailtoLink

  // Cambiar a pantalla de éxito
  enviadoExitoso.value = true
}
</script>

<template>
  <div class="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
    <div class="bg-blue-800 p-8 text-white text-center">
      <h2 class="text-2xl font-black italic uppercase tracking-tighter">Bolsa de Trabajo VIXA</h2>
      <p class="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1">Envío Seguro vía Correo Electrónico</p>
    </div>

    <div class="p-8">
      <div v-if="!enviadoExitoso" class="space-y-4">
        
        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
          <p class="text-[10px] text-amber-800 font-bold uppercase italic">
            Nota: Al dar clic en enviar, se abrirá tu aplicación de correo. No olvides adjuntar tu archivo PDF antes de mandarlo.
          </p>
        </div>

        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Tu Nombre Completo *</label>
          <input v-model="form.nombre" type="text" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Ej. Carlos Hernández" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Tu Email *</label>
            <input v-model="form.email" type="email" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" placeholder="tu@correo.com" />
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Tu Teléfono</label>
            <input v-model="form.telefono" type="tel" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" placeholder="228 123 4567" />
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

        <div class="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer group">
          <input type="file" @change="handleFileChange" accept=".pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div v-if="!form.archivoNombre" class="space-y-2">
            <div class="text-4xl">📎</div>
            <p class="text-blue-700 font-bold text-sm">Prepara tu CV (PDF)</p>
            <p class="text-[9px] text-slate-400 uppercase">Haz clic para verificar que tienes el archivo listo</p>
          </div>
          <div v-else class="text-green-600 font-bold">
            <p class="text-2xl">✅</p>
            <p class="text-xs">{{ form.archivoNombre }}</p>
            <p class="text-[9px] uppercase italic">¡No olvides adjuntarlo en el correo!</p>
          </div>
        </div>

        <button 
          @click="enviarViaMailto" 
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 uppercase tracking-widest italic flex items-center justify-center gap-3"
        >
          <span>Generar Correo de Postulación</span>
          <span class="text-xl">📧</span>
        </button>
      </div>

      <div v-else class="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div class="text-6xl mb-4">📫</div>
        <h3 class="text-2xl font-black italic text-slate-900">¡CASI LISTO!</h3>
        <p class="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
          Se ha abierto tu aplicación de correo. Asegúrate de darle a **"Enviar"** en tu bandeja de entrada para que RH reciba tu CV.
        </p>
        <button @click="enviadoExitoso = false" class="text-blue-600 font-bold text-xs uppercase underline">Volver a intentar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}
</style>
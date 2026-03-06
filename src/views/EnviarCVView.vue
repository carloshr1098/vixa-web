<script setup lang="ts">
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

// Referencia al formulario HTML para que EmailJS pueda leer el archivo adjunto
const formDocumento = ref<HTMLFormElement | null>(null)

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  puesto: 'Producción / Planta',
  archivo: null as File | null
})

const isLoading = ref(false)
const enviadoExitoso = ref(false)

// Validar que el archivo sea PDF y guardarlo en el estado
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.type !== 'application/pdf') {
      alert("Por favor, selecciona un archivo PDF.")
      target.value = ''
      return
    }
    form.value.archivo = file
  }
}

const enviarPostulacion = async () => {
  if (!form.value.nombre || !form.value.email || !form.value.archivo) {
    alert("Por favor completa los campos y adjunta tu CV.")
    return
  }

  isLoading.value = true

  try {
    // IMPORTANTE: Usamos sendForm para enviar el archivo adjunto
    await emailjs.sendForm(
      'Vixa RH',           // Tu Service ID
      'template_kap2dam',  // Tu Template ID
      formDocumento.value!, // El formulario físico
      'BLU6HXAV_22F4fzPv'  // Tu Public Key
    )

    isLoading.value = false
    enviadoExitoso.value = true

    // Limpiar formulario tras el éxito
    setTimeout(() => {
      enviadoExitoso.value = false
      form.value = { nombre: '', email: '', telefono: '', puesto: 'Producción / Planta', archivo: null }
    }, 8000)

  } catch (error) {
    console.error("Error al enviar:", error)
    alert("Error al enviar. Verifica que el PDF no sea muy pesado (Límite 500KB en plan gratuito).")
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-3xl overflow-hidden shadow-xl">
    <div class="bg-blue-800 p-8 text-white text-center">
      <h2 class="text-2xl font-black italic tracking-tighter uppercase">Bolsa de Trabajo VIXA</h2>
      <p class="text-blue-100 text-[10px] mt-2 font-bold tracking-widest uppercase opacity-80">Envío de CV Directo a RH</p>
    </div>

    <div class="p-8">
      <form 
        ref="formDocumento" 
        @submit.prevent="enviarPostulacion" 
        v-if="!enviadoExitoso" 
        class="space-y-5"
      >
        <div class="space-y-1">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Completo *</label>
          <input 
            name="nombre" 
            v-model="form.nombre" 
            type="text" 
            required
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Email *</label>
            <input 
              name="email" 
              v-model="form.email" 
              type="email" 
              required
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
            />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
            <input 
              name="telefono" 
              v-model="form.telefono" 
              type="tel" 
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Área de interés</label>
          <select 
            name="puesto" 
            v-model="form.puesto" 
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer font-medium appearance-none"
          >
            <option>Producción / Planta</option>
            <option>Ventas y Atención</option>
            <option>Logística y Distribución</option>
            <option>Administración</option>
          </select>
        </div>

        <div class="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer group">
          <input 
            type="file" 
            name="my_file" 
            @change="handleFileChange" 
            accept=".pdf" 
            required
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          
          <div v-if="!form.archivo" class="space-y-2">
            <div class="text-4xl group-hover:scale-110 transition-transform">📄</div>
            <p class="text-blue-700 font-bold text-sm">Adjuntar CV (PDF)</p>
            <p class="text-[9px] text-slate-400 uppercase font-black italic">Haz clic para buscar</p>
          </div>
          
          <div v-else class="flex items-center justify-center gap-3 text-green-600">
            <span class="text-2xl">✅</span>
            <div class="text-left">
              <p class="text-xs font-bold truncate max-w-[200px]">{{ form.archivo.name }}</p>
              <p class="text-[9px] uppercase font-black opacity-60">Archivo listo</p>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-95 disabled:bg-slate-300 uppercase tracking-widest italic"
        >
          <span v-if="!isLoading">Enviar Postulación</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Enviando Archivo...
          </span>
        </button>
      </form>

      <div v-else class="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div class="text-6xl">🚀</div>
        <h3 class="text-2xl font-black text-slate-900 italic uppercase">¡Enviado a VIXA!</h3>
        <p class="text-slate-500 text-sm max-w-xs mx-auto font-medium">Tu CV y datos han sido enviados correctamente. Revisaremos tu perfil a la brevedad.</p>
        <button @click="enviadoExitoso = false" class="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline pt-4">Nuevo registro</button>
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
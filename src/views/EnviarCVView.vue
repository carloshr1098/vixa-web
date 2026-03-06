<script setup lang="ts">
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

// Estado del formulario
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  puesto: 'Producción / Planta',
  archivo: null as File | null
})

const isLoading = ref(false)
const enviadoExitoso = ref(false)

// Manejador del archivo (Valida que sea PDF)
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

// Función de envío REAL con EmailJS
const enviarPostulacion = async () => {
  if (!form.value.nombre || !form.value.email || !form.value.archivo) {
    alert("Por favor completa los campos obligatorios y adjunta tu CV.")
    return
  }

  isLoading.value = true
  
  // Parámetros que coinciden con tu Template de EmailJS
  const templateParams = {
    nombre: form.value.nombre,
    email: form.value.email,
    telefono: form.value.telefono,
    puesto: form.value.puesto,
    archivo_nombre: form.value.archivo.name 
  };

  try {
    await emailjs.send(
      'Vixa RH',           // Tu Service ID
      'template_kap2dam',  // Tu Template ID
      templateParams,
      'BLU6HXAV_22F4fzPv'  // Tu Public Key
    );

    isLoading.value = false
    enviadoExitoso.value = true
    
    // Limpiar el formulario después de un rato
    setTimeout(() => {
      enviadoExitoso.value = false
      form.value = { nombre: '', email: '', telefono: '', puesto: 'Producción / Planta', archivo: null }
    }, 10000)

  } catch (error) {
    console.error("Error al enviar:", error)
    alert("Ocurrió un error al enviar el correo. Revisa tu conexión.")
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-3xl overflow-hidden">
    <div class="bg-blue-800 p-8 text-white text-center">
      <h2 class="text-2xl font-black italic tracking-tighter uppercase">Bolsa de Trabajo VIXA</h2>
      <p class="text-blue-100 text-[10px] mt-2 font-bold tracking-widest uppercase opacity-80">Postulación Directa a RH</p>
    </div>

    <div class="p-8">
      <div v-if="!enviadoExitoso" class="space-y-5">
        
        <div class="space-y-1">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Completo *</label>
          <input v-model="form.nombre" type="text" placeholder="Tu nombre" 
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Email *</label>
            <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" 
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
            <input v-model="form.telefono" type="tel" placeholder="228 123 4567" 
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">¿A qué área te postulas?</label>
          <select v-model="form.puesto" 
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer font-medium appearance-none">
            <option>Producción / Planta</option>
            <option>Ventas y Atención</option>
            <option>Logística y Distribución</option>
            <option>Administración</option>
          </select>
        </div>

        <div class="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer group">
          <input type="file" @change="handleFileChange" accept=".pdf" 
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          
          <div v-if="!form.archivo" class="space-y-2">
            <div class="text-4xl group-hover:scale-110 transition-transform">📄</div>
            <p class="text-blue-700 font-bold text-sm">Adjunta tu CV aquí (PDF)</p>
            <p class="text-[9px] text-slate-400 uppercase font-black">Haz clic o arrastra el archivo</p>
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
          @click="enviarPostulacion"
          :disabled="isLoading"
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all transform active:scale-95 disabled:bg-slate-300 uppercase tracking-widest italic"
        >
          <span v-if="!isLoading">Enviar Postulación</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Procesando...
          </span>
        </button>
      </div>

      <div v-else class="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div class="text-6xl">🚀</div>
        <h3 class="text-2xl font-black text-slate-900 italic">¡ENVIADO A VIXA!</h3>
        <p class="text-slate-500 text-sm max-w-xs mx-auto font-medium">Hemos recibido tu información. El equipo de Recursos Humanos revisará tu perfil pronto.</p>
        <button @click="enviadoExitoso = false" class="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline pt-4">Volver al formulario</button>
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
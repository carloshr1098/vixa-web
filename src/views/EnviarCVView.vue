<script setup lang="ts">
import { ref } from 'vue'

// Definimos la estructura de los datos
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  puesto: 'Producción / Planta',
  mensaje: '',
  archivo: null as File | null
})

const isLoading = ref(false)
const enviadoExitoso = ref(false)

// Manejador del archivo seleccionado
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.type !== 'application/pdf') {
      alert("Por favor, selecciona un archivo en formato PDF.")
      target.value = ''
      return
    }
    form.value.archivo = file
  }
}

// Función de envío (Simulada para que no te marque error de TS)
const enviarPostulacion = async () => {
  if (!form.value.nombre || !form.value.email || !form.value.archivo) {
    alert("Por favor completa los campos obligatorios y sube tu CV.")
    return
  }

  isLoading.value = true
  
  // Simulación de envío a RH
  try {
    console.log("Enviando datos de:", form.value.nombre)
    console.log("Archivo listo para subir:", form.value.archivo.name)
    
    // Aquí es donde iría la lógica de EmailJS o tu API
    setTimeout(() => {
      isLoading.value = false
      enviadoExitoso.value = true
      // Limpiar formulario después de 3 segundos
      setTimeout(() => { enviadoExitoso.value = false }, 5000)
    }, 2000)
  } catch (error) {
    alert("Hubo un error al enviar. Intenta de nuevo.")
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white font-sans">
    <div class="bg-blue-800 p-8 text-white text-center">
      <h2 class="text-2xl font-black italic tracking-tighter uppercase">Bolsa de Trabajo VIXA</h2>
      <p class="text-blue-100 text-xs mt-2 font-bold tracking-widest uppercase">Únete a nuestro equipo industrial</p>
    </div>

    <div class="p-8">
      <div v-if="!enviadoExitoso" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Completo *</label>
            <input v-model="form.nombre" type="text" placeholder="Ej. Carlos Hernández" 
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Correo Electrónico *</label>
            <input v-model="form.email" type="email" placeholder="carlos@ejemplo.com" 
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono de contacto</label>
            <input v-model="form.telefono" type="tel" placeholder="228 123 4567" 
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Área de interés</label>
            <select v-model="form.puesto" 
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
              <option>Producción / Planta</option>
              <option>Ventas y Atención</option>
              <option>Logística y Distribución</option>
              <option>Mantenimiento</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Adjuntar CV (Formato PDF) *</label>
          <div class="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer group">
            <input type="file" @change="handleFileChange" accept=".pdf" 
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            
            <div v-if="!form.archivo" class="space-y-2">
              <div class="text-4xl group-hover:scale-110 transition-transform">📄</div>
              <p class="text-blue-700 font-bold text-sm">Haz clic para seleccionar tu archivo</p>
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest">Máximo 5MB</p>
            </div>
            
            <div v-else class="flex items-center justify-center gap-3 text-green-600">
              <span class="text-2xl">✅</span>
              <div class="text-left">
                <p class="text-xs font-bold truncate max-w-[200px]">{{ form.archivo.name }}</p>
                <p class="text-[9px] uppercase font-black opacity-60">Archivo listo para enviar</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          @click="enviarPostulacion"
          :disabled="isLoading"
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-95 disabled:bg-slate-300 disabled:shadow-none uppercase tracking-widest italic"
        >
          <span v-if="!isLoading">Enviar mi postulación</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Enviando...
          </span>
        </button>
      </div>

      <div v-else class="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div class="text-6xl">🚀</div>
        <h3 class="text-2xl font-black text-slate-900 italic">¡RECIBIDO CON ÉXITO!</h3>
        <p class="text-slate-500 text-sm max-w-xs mx-auto">Tu CV ha sido enviado directamente al equipo de Selección de VIXA. Te contactaremos pronto.</p>
        <button @click="enviadoExitoso = false" class="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">Enviar otro archivo</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos extra para asegurar que el select se vea bien en móviles */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}
</style>
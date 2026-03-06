<script setup lang="ts">
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

// Estado del formulario
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  puesto: 'Producción / Planta',
  archivoBase64: '', // Aquí guardamos el PDF convertido a texto
  archivoNombre: ''
})

const isLoading = ref(false)
const enviadoExitoso = ref(false)

// Función para convertir el archivo a Base64
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // El límite gratuito real de EmailJS es de 500KB. 
    // Ponemos 450KB para estar seguros.
    if (file.size > 450 * 1024) {
      alert("El archivo es un poco pesado para el plan gratuito. Por favor, usa un PDF de menos de 450KB.");
      target.value = '';
      return;
    }

    const reader = new FileReader()
    form.value.archivoNombre = file.name
    
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Almacenamos el resultado (que es el PDF en formato texto Data-URI)
      form.value.archivoBase64 = reader.result as string
    }
  }
}

const enviarPostulacion = async () => {
  if (!form.value.nombre || !form.value.email || !form.value.archivoBase64) {
    alert("Por favor, completa los campos y selecciona tu CV en PDF.")
    return
  }

  isLoading.value = true

  // IMPORTANTE: Asegúrate de que en tu Template de EmailJS (en la web)
  // hayas puesto las etiquetas: {{nombre}}, {{email}}, {{telefono}}, {{puesto}} y {{my_file}}
  const templateParams = {
    nombre: form.value.nombre,
    email: form.value.email,
    telefono: form.value.telefono,
    puesto: form.value.puesto,
    my_file: form.value.archivoBase64, // Este envía el archivo
    archivo_nombre: form.value.archivoNombre
  }

  try {
    await emailjs.send(
      'Vixa RH',           // Tu Service ID
      'template_kap2dam',  // Tu Template ID
      templateParams,
      'BLU6HXAV_22F4fzPv'  // Tu Public Key
    )

    enviadoExitoso.value = true
    isLoading.value = false
    
    // Resetear formulario después de 5 segundos
    setTimeout(() => {
      enviadoExitoso.value = false
      form.value = { nombre: '', email: '', telefono: '', puesto: 'Producción / Planta', archivoBase64: '', archivoNombre: '' }
    }, 5000)

  } catch (error) {
    console.error("Error al enviar:", error)
    alert("Error al enviar. Intenta con un PDF más pequeño o revisa tu conexión.")
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
    <div class="bg-blue-800 p-8 text-white text-center">
      <h2 class="text-2xl font-black italic uppercase tracking-tighter">Bolsa de Trabajo VIXA</h2>
      <p class="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-1">Módulo de Reclutamiento</p>
    </div>

    <div class="p-8">
      <div v-if="!enviadoExitoso" class="space-y-4">
        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Completo *</label>
          <input 
            v-model="form.nombre" 
            type="text" 
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
            placeholder="Ej. Carlos Hernández" 
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Correo Electrónico *</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
              placeholder="tu@correo.com" 
            />
          </div>
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
            <input 
              v-model="form.telefono" 
              type="tel" 
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
              placeholder="228 123 4567" 
            />
          </div>
        </div>

        <div>
          <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Área de iinterés</label>
          <select 
            v-model="form.puesto" 
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
          >
            <option>Producción / Planta</option>
            <option>Ventas y Atención</option>
            <option>Logística y Distribución</option>
            <option>Administración</option>
          </select>
        </div>

        <div class="relative border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer group">
          <input 
            type="file" 
            @change="handleFileChange" 
            accept=".pdf" 
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <div v-if="!form.archivoBase64" class="space-y-2">
            <div class="text-4xl group-hover:scale-110 transition-transform">📄</div>
            <p class="text-blue-700 font-bold text-sm">Seleccionar CV (PDF)</p>
            <p class="text-[9px] text-slate-400 uppercase mt-1 italic">Límite 450KB para envío gratuito</p>
          </div>
          <div v-else class="text-green-600 font-bold space-y-1">
            <p class="text-2xl">✅</p>
            <p class="text-xs truncate max-w-[250px] mx-auto">{{ form.archivoNombre }}</p>
            <p class="text-[9px] uppercase font-black opacity-60">Listo para enviar</p>
          </div>
        </div>

        <button 
          @click="enviarPostulacion" 
          :disabled="isLoading" 
          class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl uppercase italic tracking-widest transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
        >
          <span v-if="!isLoading">Enviar mi CV a VIXA</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Procesando Envío...
          </span>
        </button>
      </div>

      <div v-else class="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div class="text-6xl mb-4">🚀</div>
        <h3 class="text-2xl font-black italic text-slate-900">¡RECIBIDO CON ÉXITO!</h3>
        <p class="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Tu información ya está en manos de Recursos Humanos de VIXA.</p>
        <button @click="enviadoExitoso = false" class="text-blue-600 font-bold text-xs uppercase underline">Enviar otro formulario</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Icono de flechita para el select */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}
</style>
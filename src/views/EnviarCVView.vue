<script setup lang="ts">
import { ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

// ✅ Configuración del Worker desde CDN para evitar errores de ruta en producción
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

// Estado del formulario
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  resumen: ''
})

const isLoading = ref(false)
const status = ref('')

// ✅ Función para enviar los datos (Corrigiendo el error TS2339)
const enviarRH = () => {
  if (!form.value.email) {
    alert("Por favor, sube un CV válido primero.")
    return
  }
  alert(`🚀 ¡Éxito! La postulación de ${form.value.nombre} ha sido enviada al equipo de Recursos Humanos de VIXA.`)
  // Aquí es donde conectarías con EmailJS en el futuro
}

// Lógica de extracción de datos por patrones (Regex)
const extraerDatos = (text: string) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const emailMatch = text.match(emailRegex)
  
  const phoneRegex = /(?:\+?52\s?)?(?:\d{3}[\s-]?\d{3}[\s-]?\d{4}|\d{10})/
  const phoneMatch = text.match(phoneRegex)

  const lineas = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  
  return {
    nombre: lineas[0]?.substring(0, 50) || "Candidato VIXA",
    email: emailMatch ? emailMatch[0] : '',
    telefono: phoneMatch ? phoneMatch[0] : '',
    resumen: text.substring(0, 250).replace(/\s+/g, ' ') + "..."
  }
}

// Manejador de carga de archivo
const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || file.type !== 'application/pdf') {
    status.value = "❌ Por favor selecciona un archivo PDF válido."
    return
  }

  isLoading.value = true
  status.value = "🤖 IA VIXA Analizando documento..."

  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    
    let fullText = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      // @ts-ignore - Evitamos errores estrictos de tipos en la iteración de items
      const pageText = content.items.map((item: any) => item.str).join(' ')
      fullText += pageText + "\n"
    }

    if (fullText.trim().length === 0) {
      throw new Error("El PDF no contiene texto legible (podría ser una imagen).")
    }

    const datosExtraidos = extraerDatos(fullText)
    form.value = datosExtraidos
    status.value = "✅ ¡Análisis completado con éxito!"

  } catch (error) {
    console.error("Error al procesar PDF:", error)
    status.value = "❌ Error al leer el PDF. Intenta con otro archivo."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white">
    <div class="bg-blue-700 p-8 text-white text-center">
      <h2 class="text-2xl font-black italic tracking-tighter uppercase">Bolsa de Trabajo VIXA</h2>
      <p class="text-blue-100 text-xs mt-2 opacity-90 uppercase font-bold tracking-widest">Postulación con Inteligencia Artificial</p>
    </div>

    <div class="p-8">
      <div class="relative border-4 border-dashed border-slate-100 rounded-3xl p-10 text-center hover:border-blue-200 transition-all bg-slate-50 group">
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept=".pdf" 
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        
        <div v-if="!isLoading">
          <div class="text-5xl mb-4 group-hover:scale-110 transition-transform">📄</div>
          <p class="text-slate-600 font-bold">Arrastra tu CV aquí o haz clic</p>
          <p class="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">
            {{ status || 'Solo archivos PDF' }}
          </p>
        </div>
        
        <div v-else class="flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-blue-700 font-black animate-pulse uppercase text-xs tracking-widest">{{ status }}</p>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="form.nombre" class="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Detectado</label>
              <input v-model="form.nombre" class="w-full bg-slate-100 border-none rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-blue-500 font-bold" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
              <input v-model="form.telefono" class="w-full bg-slate-100 border-none rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-blue-500 font-bold" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Correo Electrónico</label>
            <input v-model="form.email" class="w-full bg-slate-100 border-none rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-blue-500 font-bold" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Extracto de Perfil Profesional</label>
            <textarea v-model="form.resumen" class="w-full bg-slate-100 border-none rounded-xl p-4 text-slate-700 h-32 focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"></textarea>
          </div>

          <button 
            @click="enviarRH" 
            class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all uppercase tracking-widest italic text-sm"
          >
            Confirmar y Enviar a VIXA
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
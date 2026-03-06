<script setup lang="ts">
import { ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

// ✅ CONFIGURACIÓN BLINDADA (Usamos un worker externo para evitar errores)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  resumen: ''
})

const isLoading = ref(false)
const status = ref('')

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
    resumen: text.substring(0, 250) + "..."
  }
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isLoading.value = true
  status.value = "Leyendo CV..."

  try {
    const arrayBuffer = await file.arrayBuffer()
    // Cambiamos la forma de cargar para que sea más compatible
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: true,
      isEvalSupported: false
    })
    
    const pdf = await loadingTask.promise
    let fullText = ""
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      // @ts-ignore
      const pageText = content.items.map((item) => item.str).join(' ')
      fullText += pageText + "\n"
    }

    if (fullText.trim().length === 0) {
      throw new Error("El PDF parece estar vacío o ser una imagen")
    }

    const datos = extraerDatos(fullText)
    form.value = datos
    status.value = "✅ ¡Datos extraídos!"
    
  } catch (error) {
    console.error("Error técnico:", error)
    status.value = "❌ ERROR AL LEER EL PDF. Intenta con otro archivo."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 font-sans">
    <div class="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div class="bg-blue-800 p-8 text-white">
        <h2 class="text-2xl font-black italic uppercase tracking-tighter">Bolsa de Trabajo VIXA</h2>
        <p class="text-blue-100 text-sm opacity-80 mt-1">Sube tu CV y nuestro sistema extraerá tu información.</p>
      </div>

      <div class="p-8">
        <div class="relative border-4 border-dashed border-slate-100 rounded-3xl p-12 text-center hover:border-blue-200 transition-all bg-slate-50">
          <input type="file" @change="handleFileUpload" accept=".pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          
          <div v-if="!isLoading">
            <span class="text-5xl block mb-4">📂</span>
            <p class="text-slate-600 font-bold">Haz clic o arrastra tu CV (PDF)</p>
            <p class="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">{{ status || 'Esperando archivo...' }}</p>
          </div>
          
          <div v-else class="flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-blue-700 font-black animate-pulse uppercase text-xs">{{ status }}</p>
          </div>
        </div>

        <div v-if="form.nombre" class="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Extraído</label>
              <input v-model="form.nombre" class="w-full bg-slate-100 border-none rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono</label>
              <input v-model="form.telefono" class="w-full bg-slate-100 border-none rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Correo de contacto</label>
            <input v-model="form.email" class="w-full bg-slate-100 border-none rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Vista previa de experiencia</label>
            <textarea v-model="form.resumen" class="w-full bg-slate-100 border-none rounded-xl p-3 text-slate-700 h-32 focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <button @click="enviarRH" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all uppercase tracking-widest italic">
            Enviar mi CV a VIXA
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
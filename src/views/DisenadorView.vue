<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCotizadorStore } from '../stores/cotizador'
import productosData from '../data/productos.json' 

// FUNCIÓN PARA CARGAR IMÁGENES DINÁMICAMENTE
const getImageUrl = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}

const store = useCotizadorStore()

const tipoMedida = ref('') 
const aceptoMedidas = ref(false)

const instalaciones = [
  { id: 'cancel', nombre: 'Cancel de Baño', icono: '🚿', desc: 'Sistemas corredizos o abatibles para duchas.' },
  { id: 'puerta', nombre: 'Puerta Abatible', icono: '🚪', desc: 'Puertas de interior o exterior con bisagras.' },
  { id: 'barandal', nombre: 'Barandal', icono: '🪜', desc: 'Seguridad y diseño con herrajes o sistemas fijos.' },
  { id: 'fijo', nombre: 'Panel Fijo / Fachada', icono: '🪟', desc: 'Divisiones de espacios o ventanales fijos.' },
  { id: 'formas', nombre: 'Formas Especiales', icono: '⭕', desc: 'Espejos, cubiertas de mesa o cortes irregulares.' }
]

const vidrios = productosData.filter(p => p.categoria === 'Vidrio')

const seleccionarInstalacion = (id: string) => {
  store.proyecto.tipoInstalacion = id
}
const seleccionarVidrio = (nombre: string) => {
  store.proyecto.tipoVidrio = nombre
}

const errorMedidas = computed(() => {
  const ancho = store.proyecto.medidas.ancho
  const alto = store.proyecto.medidas.alto
  if (!ancho || !alto) return 'Por favor, ingresa el ancho y el alto para continuar.'
  const ladoCorto = Math.min(ancho, alto)
  const ladoLargo = Math.max(ancho, alto)
  if (ladoCorto < 20 || ladoLargo < 30) return 'La medida mínima de templado es de 20 cm x 30 cm.'
  if (ladoCorto > 240 || ladoLargo > 500) return 'La medida excede la capacidad máxima de nuestro horno (500 cm x 240 cm).'
  return ''
})

const bloquearCaracteres = (event: KeyboardEvent) => {
  if (['-', '+', 'e', 'E'].includes(event.key)) { event.preventDefault() }
}

const paso3Incompleto = computed(() => {
  const d = store.proyecto.detalles
  if (store.proyecto.tipoInstalacion === 'cancel') {
    if (!d.tipoCancel) return true
    if (d.tipoCancel === 'corredizo') {
      if (!d.espesor) return true
      if (!d.sistemaCorredizo) return true
    }
  }
  if (['barandal', 'formas'].includes(store.proyecto.tipoInstalacion)) {
    if (!d.plantilla) return true
  }
  return false
})

const enlaceWhatsApp = computed(() => {
  const p = store.proyecto
  const instalacionNombre = instalaciones.find(i => i.id === p.tipoInstalacion)?.nombre || 'Proyecto'
  const tipoMedidaTexto = tipoMedida.value === 'fabricacion' ? 'Medidas de fabricación (exactas)' : 'Medidas de vano (con descuentos)'
  
  let detallesTexto = ''
  if (p.tipoInstalacion === 'cancel') {
    if (p.detalles.tipoCancel === 'corredizo') {
      detallesTexto = `\n*⚙️ Sistema:* Cancel Corredizo\n*📏 Espesor:* ${p.detalles.espesor}\n*🛠️ Herraje:* ${p.detalles.sistemaCorredizo}`
    } else {
      detallesTexto = `\n*⚙️ Sistema:* Cancel Abatible`
    }
  } else if (['barandal', 'formas'].includes(p.tipoInstalacion)) {
    detallesTexto = `\n*📐 Plantilla:* ${p.detalles.plantilla === 'si' ? 'El cliente proporcionará plantilla' : 'Sin plantilla'}`
  }

  const mensaje = `¡Hola equipo de VIXA! 👋\nMe gustaría cotizar un proyecto diseñado desde su sitio web:\n\n*📌 Proyecto:* ${instalacionNombre}\n*📏 Medidas:* ${p.medidas.ancho} cm x ${p.medidas.alto} cm\n*📐 Tipo de Medida:* ${tipoMedidaTexto}${detallesTexto}\n*🪟 Vidrio Elegido:* ${p.tipoVidrio}\n\n¿Me podrían apoyar con la cotización?`
  
  return `https://wa.me/5212299782548?text=${encodeURIComponent(mensaje)}`
})
</script>

<template>
  <div class="py-12 bg-slate-50 min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center mb-10">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Diseña tu Espacio</h2>
        <p class="mt-4 text-lg text-slate-600 font-medium">Paso {{ store.pasoActual }} de 4</p>
        <div class="w-full bg-slate-200 rounded-full h-2.5 mt-6 max-w-md mx-auto overflow-hidden">
          <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" :style="`width: ${(store.pasoActual / 4) * 100}%`"></div>
        </div>
      </div>

      <div v-if="store.pasoActual === 1" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-4xl mx-auto">
        <h3 class="text-xl font-bold text-slate-800 mb-6 text-center">¿Qué proyecto tienes en mente?</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button v-for="item in instalaciones" :key="item.id" @click="seleccionarInstalacion(item.id)" :class="['p-6 rounded-xl border-2 text-left transition-all duration-200 flex flex-col group', store.proyecto.tipoInstalacion === item.id ? 'border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50']">
            <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">{{ item.icono }}</span>
            <span class="text-lg font-bold text-slate-900 mb-1">{{ item.nombre }}</span>
            <span class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</span>
          </button>
        </div>
        <div class="mt-10 flex justify-end">
          <button @click="store.avanzarPaso" :disabled="!store.proyecto.tipoInstalacion" :class="['px-8 py-3 rounded-lg font-bold transition-all duration-300', store.proyecto.tipoInstalacion ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed']">Continuar al Paso 2 &rarr;</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 2" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-4xl mx-auto">
        <h3 class="text-xl font-bold text-slate-800 mb-8 text-center">Ingresa las medidas de tu vidrio (en centímetros)</h3>
        <div class="max-w-md mx-auto space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Ancho (cm)</label>
              <input type="number" min="0" @keydown="bloquearCaracteres" v-model.number="store.proyecto.medidas.ancho" class="block w-full rounded-lg border-slate-300 border px-4 py-3 focus:border-blue-600 focus:ring-blue-600 text-lg transition-colors outline-none" placeholder="Ej. 120">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Alto (cm)</label>
              <input type="number" min="0" @keydown="bloquearCaracteres" v-model.number="store.proyecto.medidas.alto" class="block w-full rounded-lg border-slate-300 border px-4 py-3 focus:border-blue-600 focus:ring-blue-600 text-lg transition-colors outline-none" placeholder="Ej. 210">
            </div>
          </div>
          <div class="min-h-[20px] text-center"><p v-if="errorMedidas" class="text-sm font-semibold" :class="errorMedidas.includes('Por favor') ? 'text-slate-500' : 'text-red-600'">{{ errorMedidas }}</p></div>
          
          <div v-if="!errorMedidas" class="mt-6 border-t border-slate-100 pt-6 animate-fade-in">
            <label class="block text-sm font-bold text-slate-700 mb-4">¿A qué corresponden estas medidas?</label>
            <div class="space-y-3">
              <label class="flex items-start cursor-pointer group p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors" :class="{'bg-blue-50 border-blue-200': tipoMedida === 'fabricacion'}">
                <input type="radio" v-model="tipoMedida" value="fabricacion" @change="aceptoMedidas = false" class="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600">
                <span class="ml-3"><span class="block text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Medidas de fabricación</span><span class="block text-xs text-slate-500 mt-1">Son las medidas finales exactas.</span></span>
              </label>
              <label class="flex items-start cursor-pointer group p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors" :class="{'bg-blue-50 border-blue-200': tipoMedida === 'vano'}">
                <input type="radio" v-model="tipoMedida" value="vano" @change="aceptoMedidas = false" class="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600">
                <span class="ml-3"><span class="block text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Medidas de vano</span><span class="block text-xs text-slate-500 mt-1">Se harán los descuentos correspondientes.</span></span>
              </label>
            </div>
          </div>
          <div v-if="tipoMedida && !errorMedidas" class="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg animate-fade-in">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="aceptoMedidas" class="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-600">
              <span class="ml-3 text-sm font-bold text-blue-900 leading-tight">Acepto que las medidas son de {{ tipoMedida }}.</span>
            </label>
          </div>
        </div>
        <div class="mt-10 flex justify-between items-center">
          <button @click="store.retrocederPaso" class="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">&larr; Regresar</button>
          <button @click="store.avanzarPaso" :disabled="!!errorMedidas || !tipoMedida || !aceptoMedidas" :class="['px-8 py-3 rounded-lg font-bold transition-all duration-300', (!errorMedidas && tipoMedida && aceptoMedidas) ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed']">Siguiente Paso &rarr;</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 3" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-2xl mx-auto">
        <h3 class="text-xl font-bold text-slate-800 mb-8 text-center">Detalles de Especificación</h3>
        <div class="space-y-8">
          <div v-if="store.proyecto.tipoInstalacion === 'cancel'" class="space-y-8 animate-fade-in">
            <label class="block text-base font-bold text-slate-700 mb-4 text-center">¿Qué tipo de apertura requiere tu cancel?</label>
            <div class="flex gap-4">
              <label class="flex-1 cursor-pointer group p-4 rounded-xl border-2 text-center transition-all" :class="store.proyecto.detalles.tipoCancel === 'abatible' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'">
                <input type="radio" v-model="store.proyecto.detalles.tipoCancel" value="abatible" class="hidden">
                <span class="block text-2xl mb-2">🚪</span>
                <span class="font-bold text-slate-800">Abatible</span>
              </label>
              <label class="flex-1 cursor-pointer group p-4 rounded-xl border-2 text-center transition-all" :class="store.proyecto.detalles.tipoCancel === 'corredizo' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'">
                <input type="radio" v-model="store.proyecto.detalles.tipoCancel" value="corredizo" class="hidden">
                <span class="block text-2xl mb-2">↔️</span>
                <span class="font-bold text-slate-800">Corredizo</span>
              </label>
            </div>
            
            <div v-if="store.proyecto.detalles.tipoCancel === 'corredizo'" class="space-y-6 animate-fade-in border-t border-slate-100 pt-6">
              <label class="block text-sm font-bold text-slate-700 mb-3">¿Qué espesor de vidrio usarás?</label>
              <div class="flex gap-4">
                <label v-for="e in ['6mm', '10mm']" :key="e" class="flex-1 cursor-pointer group p-3 rounded-xl border-2 text-center transition-all" :class="store.proyecto.detalles.espesor === e ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'">
                  <input type="radio" v-model="store.proyecto.detalles.espesor" :value="e" @change="store.proyecto.detalles.sistemaCorredizo = ''" class="hidden">
                  <span class="font-bold text-slate-800">{{ e }}</span>
                </label>
              </div>
              <div v-if="store.proyecto.detalles.espesor" class="animate-fade-in">
                <label class="block text-sm font-bold text-slate-700 mb-2">Selecciona el sistema corredizo:</label>
                <select v-model="store.proyecto.detalles.sistemaCorredizo" class="block w-full rounded-lg border-slate-300 border px-4 py-3 outline-none bg-white font-medium text-slate-700 cursor-pointer">
                  <option value="" disabled>Elige un sistema...</option>
                  <template v-if="store.proyecto.detalles.espesor === '6mm'">
                    <option value="Sistema Corredizo Bruken">Sistema Corredizo Bruken</option>
                    <option value="Sistema Acuario">Sistema Acuario</option>
                  </template>
                  <template v-if="store.proyecto.detalles.espesor === '10mm'">
                    <option value="Sistema Libra">Sistema Libra</option>
                    <option value="Sistema Bacalar">Sistema Bacalar</option>
                    <option value="Sistema Cozumel">Sistema Cozumel</option>
                    <option value="Sistema Oaxaca">Sistema Oaxaca</option>
                  </template>
                </select>
              </div>
            </div>
          </div>

          <div v-if="['barandal', 'formas'].includes(store.proyecto.tipoInstalacion)" class="space-y-6 animate-fade-in">
            <label class="block text-base font-bold text-slate-700 mb-4 text-center">¿Enviarás alguna plantilla física o digital?</label>
            <div class="flex gap-4">
              <label class="flex-1 cursor-pointer group p-4 rounded-xl border-2 text-center transition-all" :class="store.proyecto.detalles.plantilla === 'si' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'">
                <input type="radio" v-model="store.proyecto.detalles.plantilla" value="si" class="hidden">
                <span class="block text-2xl mb-2">✅</span>
                <span class="font-bold text-slate-800">Sí, enviaré</span>
              </label>
              <label class="flex-1 cursor-pointer group p-4 rounded-xl border-2 text-center transition-all" :class="store.proyecto.detalles.plantilla === 'no' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'">
                <input type="radio" v-model="store.proyecto.detalles.plantilla" value="no" class="hidden">
                <span class="block text-2xl mb-2">❌</span>
                <span class="font-bold text-slate-800">No tengo</span>
              </label>
            </div>
          </div>
        </div>
        <div class="mt-10 flex justify-between items-center">
          <button @click="store.retrocederPaso" class="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">&larr; Regresar</button>
          <button @click="store.avanzarPaso" :disabled="paso3Incompleto" :class="['px-8 py-3 rounded-lg font-bold transition-all duration-300', !paso3Incompleto ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed']">Continuar al Paso 4 &rarr;</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 4" class="animate-fade-in">
        <h3 class="text-xl font-bold text-slate-800 mb-8 text-center">Elige tu tipo de vidrio</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <button v-for="vidrio in vidrios" :key="vidrio.id" @click="seleccionarVidrio(vidrio.nombre)" :class="['bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col text-left group', store.proyecto.tipoVidrio === vidrio.nombre ? 'border-blue-600 ring-4 ring-blue-600/20 transform scale-[1.02]' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg']">
            <div class="h-24 w-full flex items-center justify-center border-b border-slate-100 bg-slate-50 p-4">
              <img 
                v-if="vidrio.logo" 
                :src="getImageUrl(vidrio.logo)" 
                :alt="vidrio.nombre"
                class="max-h-full object-contain"
              />
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-slate-900 mb-1">{{ vidrio.nombre }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed line-clamp-3">{{ vidrio.desc }}</p>
            </div>
          </button>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
          <button @click="store.retrocederPaso" class="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto text-center">&larr; Regresar</button>
          <a v-if="store.proyecto.tipoVidrio" :href="enlaceWhatsApp" target="_blank" class="px-8 py-4 rounded-lg font-extrabold text-white bg-[#25D366] hover:bg-[#1EBE57] shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center animate-fade-in">
            <span>Enviar Cotización por WhatsApp</span>
          </a>
          <button v-else disabled class="px-8 py-4 rounded-lg font-bold text-slate-400 bg-slate-200 cursor-not-allowed w-full sm:w-auto">Selecciona un vidrio para cotizar</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCotizadorStore } from '../stores/cotizador'

// FUNCIÓN PARA CARGAR IMÁGENES DINÁMICAMENTE
const getImageUrl = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}

interface Variante {
  nombre: string;
  clase: string;
}

interface Familia {
  id: string;
  nombre: string;
  desc: string;
  espesores: string[];
  variantes: Variante[];
}

const store = useCotizadorStore()

const tipoMedida = ref('') 
const aceptoMedidas = ref(false)
const familiaSeleccionada = ref<Familia | null>(null)

const instalaciones = [
  { id: 'cancel', nombre: 'Cancel de Baño', icono: '🚿', desc: 'Sistemas corredizos o abatibles para duchas.' },
  { id: 'puerta', nombre: 'Puerta Abatible', icono: '🚪', desc: 'Puertas de interior o exterior con bisagras.' },
  { id: 'barandal', nombre: 'Barandal', icono: '🪜', desc: 'Seguridad y diseño con herrajes o sistemas fijos.' },
  { id: 'fijo', nombre: 'Panel Fijo / Fachada', icono: '🪟', desc: 'Divisiones de espacios o ventanales fijos.' },
  { id: 'formas', nombre: 'Formas Especiales', icono: '⭕', desc: 'Espejos, cubiertas de mesa o cortes irregulares.' }
]

const familiasVidrio: Familia[] = [
  {
    id: 'EVO',
    nombre: 'EVO (Alto Desempeño)',
    desc: 'Control solar de última generación con capas de baja emisividad.',
    espesores: ['6mm', '10mm'],
    variantes: [
      { nombre: 'EVO 50', clase: 'bg-slate-300' },
      { nombre: 'EVO 67', clase: 'bg-blue-50 border' },
      { nombre: 'EVO Blue', clase: 'bg-blue-400' }
    ]
  },
  {
    id: 'SolLite',
    nombre: 'Sol-Lite',
    desc: 'Protección solar eficiente. En templado solo disponible en 6mm.',
    espesores: ['6mm'],
    variantes: [
      { nombre: 'Sol-Lite Gris', clase: 'bg-gray-500' },
      { nombre: 'Sol-Lite Verde', clase: 'bg-emerald-500' },
      { nombre: 'Sol-Lite Claro', clase: 'bg-slate-200' }
    ]
  },
  {
    id: 'Parsol',
    nombre: 'Parsol (Color)',
    desc: 'Vidrio entintado de alta estética para privacidad y diseño.',
    espesores: ['6mm', '10mm'],
    variantes: [
      { nombre: 'Parsol Gris', clase: 'bg-gray-600' },
      { nombre: 'Parsol Gris Plus', clase: 'bg-slate-800' },
      { nombre: 'Parsol Verde', clase: 'bg-green-700' }
    ]
  },
{
    id: 'CoolLite',
    nombre: 'Cool-Lite',
    desc: 'Vidrio de control solar avanzado. Nota: En templado solo disponible en 6mm.',
    espesores: ['6mm'],
    variantes: [
      { nombre: 'Cool-Lite SKN', clase: 'bg-sky-100 border border-sky-200' },
      { nombre: 'Cool-Lite ST', clase: 'bg-slate-300' },
      { nombre: 'Cool-Lite Extreme', clase: 'bg-slate-700' }
    ]
  },
  {
    id: 'Timeless',
    nombre: 'Timeless',
    desc: 'Vidrio anticorrosión diseñado para baños. Fácil de limpiar y mantiene su brillo.',
    espesores: ['6mm', '10mm'],
    variantes: [
      { nombre: 'Timeless Claro', clase: 'bg-white border-4 border-blue-50' }
    ]
  },
  {
    id: 'Bioclean',
    nombre: 'Bioclean',
    desc: 'Vidrio autolimpiable ideal para exteriores, domos y fachadas de difícil acceso.',
    espesores: ['6mm', '10mm'],
    variantes: [
      { nombre: 'Bioclean Claro', clase: 'bg-cyan-50 border-2 border-cyan-200' }
    ]
  },
  {
    id: 'Reflectivos',
    nombre: 'Reflectivos / Espejo',
    desc: 'Vidrio con recubrimiento reflectante. Ideal para diseño de interiores y espejos.',
    espesores: ['6mm'], // ¡El sistema lo bloquea en 6mm en automático!
    variantes: [
      { 
        nombre: 'Luna (Espejo)', 
        // Le ponemos un gradiente plateado para que simule el efecto de un espejo real
        clase: 'bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 border border-slate-300' 
      }
    ]
  },
  {
    id: 'Clasicos',
    nombre: 'Clásicos',
    desc: 'Vidrio claro y extra claro de alta resistencia.',
    espesores: ['6mm', '10mm', '12mm'],
    variantes: [
      { nombre: 'Claro', clase: 'bg-white border' },
      { nombre: 'Extra Claro', clase: 'bg-cyan-50 border-2 border-cyan-100' }
    ]
  }
]

const seleccionarInstalacion = (id: string) => {
  store.proyecto.tipoInstalacion = id
}

const seleccionarFamilia = (fam: Familia) => {
  familiaSeleccionada.value = fam
  store.proyecto.tipoVidrio = '' 
  if (fam.espesores && fam.espesores.length > 0) {
    store.proyecto.detalles.espesor = fam.espesores[0] as string
  }
}

const seleccionarVariante = (nombre: string) => {
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

const tieneErrorMedidas = computed(() => errorMedidas.value !== '' && errorMedidas.value !== 'Por favor, ingresa el ancho y el alto para continuar.')

const bloquearCaracteres = (event: KeyboardEvent) => {
  if (['-', '+', 'e', 'E'].includes(event.key)) { event.preventDefault() }
}

const paso4Incompleto = computed(() => {
  const d = store.proyecto.detalles
  if (store.proyecto.tipoInstalacion === 'cancel') {
    if (!d.tipoCancel) return true
    if (d.tipoCancel === 'corredizo' && !d.sistemaCorredizo) return true
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
      detallesTexto = `\n*🔸 Sistema:* Cancel Corredizo\n*🔸 Herraje:* ${p.detalles.sistemaCorredizo}`
    } else {
      detallesTexto = `\n*🔸 Sistema:* Cancel Abatible`
    }
  } else if (['barandal', 'formas'].includes(p.tipoInstalacion)) {
    detallesTexto = `\n*🔸 Plantilla:* ${p.detalles.plantilla === 'si' ? 'El cliente proporcionará plantilla' : 'Sin plantilla'}`
  }

  // Usamos emojis universales que no se rompen en ningún compilador
  const mensaje = `¡Hola equipo de VIXA! 👋\nMe gustaría cotizar un proyecto diseñado desde su sitio web:\n\n*🔹 Proyecto:* ${instalacionNombre}\n*🔹 Vidrio Elegido:* ${p.tipoVidrio} (${p.detalles.espesor})\n*🔹 Medidas:* ${p.medidas.ancho} x ${p.medidas.alto} cm\n*🔹 Tipo de Medida:* ${tipoMedidaTexto}${detallesTexto}\n\n¿Me podrían apoyar con la cotización?`
  
  return `https://wa.me/5212299782548?text=${encodeURIComponent(mensaje)}`
})
</script>

<template>
  <div class="py-12 bg-slate-50 min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center mb-10">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Diseña tu Espacio</h2>
        <p class="mt-4 text-lg text-slate-600 font-medium">Paso {{ store.pasoActual }} de 5</p>
        <div class="w-full bg-slate-200 rounded-full h-2.5 mt-6 max-w-md mx-auto overflow-hidden">
          <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" :style="`width: ${(store.pasoActual / 5) * 100}%`"></div>
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

      <div v-else-if="store.pasoActual === 2" class="animate-fade-in">
        <h3 class="text-xl font-bold text-slate-800 mb-8 text-center">Elige tu tipo de vidrio y espesor</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <button v-for="fam in familiasVidrio" :key="fam.id" @click="seleccionarFamilia(fam)"
             :class="['p-4 rounded-2xl border-2 transition-all font-bold text-sm', familiaSeleccionada?.id === fam.id ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-white bg-white text-slate-600 hover:border-slate-200 shadow-sm']">
             {{ fam.nombre }}
           </button>
        </div>

        <div v-if="familiaSeleccionada" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in mb-8 text-center">
           <p class="text-slate-500 text-sm mb-6">{{ familiaSeleccionada.desc }}</p>
           
           <div class="flex flex-wrap justify-center gap-8">
              <div v-for="v in familiaSeleccionada.variantes" :key="v.nombre" @click="seleccionarVariante(v.nombre)" class="group cursor-pointer flex flex-col items-center">
                 <div :class="[v.clase, 'w-16 h-16 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ring-offset-4 transition-all duration-300', store.proyecto.tipoVidrio === v.nombre ? 'ring-2 ring-blue-600 scale-110' : 'hover:scale-105']"></div>
                 <span :class="['mt-3 text-xs font-bold transition-colors', store.proyecto.tipoVidrio === v.nombre ? 'text-blue-600' : 'text-slate-500']">{{ v.nombre }}</span>
              </div>
           </div>

           <div class="mt-8 pt-6 border-t border-slate-100">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Espesores Disponibles</p>
              <div class="flex justify-center gap-4">
                 <button v-for="esp in familiaSeleccionada.espesores" :key="esp" 
                   @click="store.proyecto.detalles.espesor = esp as string"
                   :class="['px-6 py-2 rounded-full font-bold text-sm transition-all', store.proyecto.detalles.espesor === esp ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200']">
                   {{ esp }}
                 </button>
              </div>
           </div>
        </div>

        <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <button @click="store.retrocederPaso" class="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">&larr; Regresar</button>
          <button @click="store.avanzarPaso" :disabled="!store.proyecto.tipoVidrio || !store.proyecto.detalles.espesor" :class="['px-8 py-3 rounded-lg font-bold transition-all duration-300', store.proyecto.tipoVidrio && store.proyecto.detalles.espesor ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed']">Continuar al Paso 3 &rarr;</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 3" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-4xl mx-auto">
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
          
          <div v-if="!tieneErrorMedidas && store.proyecto.medidas.ancho" class="mt-6 border-t border-slate-100 pt-6 animate-fade-in">
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
          <div v-if="tipoMedida && !tieneErrorMedidas && store.proyecto.medidas.ancho" class="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg animate-fade-in">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="aceptoMedidas" class="w-5 h-5 rounded text-blue-600 border-slate-300 focus:ring-blue-600">
              <span class="ml-3 text-sm font-bold text-blue-900 leading-tight">Acepto que las medidas son de {{ tipoMedida }}.</span>
            </label>
          </div>
        </div>
        <div class="mt-10 flex justify-between items-center">
          <button @click="store.retrocederPaso" class="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">&larr; Regresar</button>
          <button @click="store.avanzarPaso" :disabled="!!tieneErrorMedidas || !store.proyecto.medidas.ancho || !tipoMedida || !aceptoMedidas" :class="['px-8 py-3 rounded-lg font-bold transition-all duration-300', (!tieneErrorMedidas && store.proyecto.medidas.ancho && tipoMedida && aceptoMedidas) ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed']">Siguiente Paso &rarr;</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 4" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-2xl mx-auto">
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
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Selecciona el sistema corredizo (para {{ store.proyecto.detalles.espesor }}):</label>
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
                <span class="font-bold text-slate-800">No se requiere</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <button @click="store.retrocederPaso" class="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto text-center">&larr; Regresar</button>
          
          <button @click="store.avanzarPaso" :disabled="paso4Incompleto" :class="['px-8 py-3 rounded-lg font-bold transition-all duration-300', !paso4Incompleto ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed w-full sm:w-auto']">
            Ver Resumen de Cotización &rarr;
          </button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 5" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-2xl mx-auto">
        <h3 class="text-2xl font-black text-slate-800 mb-6 text-center">Resumen de tu Proyecto</h3>
        
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 space-y-4 text-slate-700">
           <div class="flex items-center gap-4 pb-4 border-b border-slate-200">
             <span class="text-4xl">{{ instalaciones.find(i => i.id === store.proyecto.tipoInstalacion)?.icono }}</span>
             <div>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proyecto</p>
               <p class="text-lg font-bold text-slate-900">{{ instalaciones.find(i => i.id === store.proyecto.tipoInstalacion)?.nombre }}</p>
             </div>
           </div>
           
           <div class="grid grid-cols-2 gap-4 pt-2">
             <div>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vidrio</p>
               <p class="font-bold text-slate-800">{{ store.proyecto.tipoVidrio }} ({{ store.proyecto.detalles.espesor }})</p>
             </div>
             <div>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medidas</p>
               <p class="font-bold text-slate-800">{{ store.proyecto.medidas.ancho }} x {{ store.proyecto.medidas.alto }} cm</p>
               <p class="text-xs text-slate-500">{{ tipoMedida === 'fabricacion' ? 'Fabricación exacta' : 'Medida de vano' }}</p>
             </div>
           </div>

           <div class="pt-4 border-t border-slate-200 mt-2" v-if="store.proyecto.tipoInstalacion === 'cancel'">
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistema</p>
             <p class="font-bold text-slate-800 capitalize">Cancel {{ store.proyecto.detalles.tipoCancel }}</p>
             <p class="text-sm text-slate-600" v-if="store.proyecto.detalles.tipoCancel === 'corredizo'">Herraje: {{ store.proyecto.detalles.sistemaCorredizo }}</p>
           </div>
           
           <div class="pt-4 border-t border-slate-200 mt-2" v-if="['barandal', 'formas'].includes(store.proyecto.tipoInstalacion)">
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plantilla</p>
             <p class="font-bold text-slate-800">{{ store.proyecto.detalles.plantilla === 'si' ? 'Se enviará plantilla' : 'No cuenta con plantilla' }}</p>
           </div>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
          <p class="text-[11px] text-blue-800 font-medium">
            <strong class="uppercase font-black">¡Casi listo!</strong> Revisa que todo esté correcto. Al dar clic en enviar, tu solicitud llegará por WhatsApp y un asesor de VIXA procesará tu cotización exacta.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
          <button @click="store.retrocederPaso" class="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto text-center">&larr; Modificar datos</button>
          
          <a :href="enlaceWhatsApp" target="_blank" class="px-8 py-4 rounded-lg font-extrabold text-white bg-[#25D366] hover:bg-[#1EBE57] shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center animate-fade-in">
            <span class="text-2xl">💬</span>
            <span>Enviar a WhatsApp</span>
          </a>
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
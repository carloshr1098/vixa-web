<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCotizadorStore } from '../stores/cotizador'

// 1. DEFINICIÓN DE INTERFACES PARA TYPESCRIPT
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
    desc: 'Protección solar eficiente. Nota: En templado solo disponible en 6mm.',
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
  if (fam.espesores.length === 1) {
    store.proyecto.detalles.espesor = fam.espesores[0]
  }
}

const seleccionarVariante = (nombre: string) => {
  store.proyecto.tipoVidrio = nombre
}

// CORRECCIÓN DE ERROR TS2322: Separamos el mensaje de la validación booleana
const mensajeErrorMedidas = computed(() => {
  const ancho = store.proyecto.medidas.ancho
  const alto = store.proyecto.medidas.alto
  if (!ancho || !alto) return ''
  const min = Math.min(ancho, alto), max = Math.max(ancho, alto)
  if (min < 20 || max < 30) return 'Mínimo: 20x30 cm.'
  if (min > 240 || max > 500) return 'Excede capacidad (500x240 cm).'
  return ''
})

const tieneErrorCritico = computed(() => mensajeErrorMedidas.value !== '')
const medidasIncompletas = computed(() => !store.proyecto.medidas.ancho || !store.proyecto.medidas.alto)

const bloquearCaracteres = (event: KeyboardEvent) => {
  if (['-', '+', 'e', 'E'].includes(event.key)) { event.preventDefault() }
}

const paso3Incompleto = computed(() => {
  const d = store.proyecto.detalles
  if (store.proyecto.tipoInstalacion === 'cancel') {
    if (!d.tipoCancel) return true
    if (d.tipoCancel === 'corredizo') {
      if (!d.espesor || !d.sistemaCorredizo) return true
    }
  }
  return false
})

const enlaceWhatsApp = computed(() => {
  const p = store.proyecto
  const msg = `¡Hola VIXA! 👋\nCotización Web:\n*Proyecto:* ${p.tipoInstalacion}\n*Vidrio:* ${p.tipoVidrio} (${p.detalles.espesor})\n*Medidas:* ${p.medidas.ancho}x${p.medidas.alto} cm\n*Sistema:* ${p.detalles.sistemaCorredizo || 'N/A'}`
  return `https://wa.me/5212299782548?text=${encodeURIComponent(msg)}`
})
</script>

<template>
  <div class="py-12 bg-slate-50 min-h-screen font-sans">
    <div class="max-w-5xl mx-auto px-4">
      
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Diseña tu Espacio</h2>
        <div class="w-full bg-slate-200 h-1.5 mt-6 max-w-xs mx-auto rounded-full overflow-hidden">
          <div class="bg-blue-600 h-full transition-all duration-700" :style="`width: ${(store.pasoActual / 4) * 100}%`"></div>
        </div>
      </div>

      <div v-if="store.pasoActual === 1" class="animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button v-for="item in instalaciones" :key="item.id" @click="seleccionarInstalacion(item.id)" 
          :class="['p-6 rounded-3xl border-2 transition-all text-left flex flex-col', store.proyecto.tipoInstalacion === item.id ? 'border-blue-600 bg-blue-50 shadow-xl scale-[1.02]' : 'border-white bg-white hover:border-slate-200 shadow-sm']">
          <span class="text-4xl mb-4">{{ item.icono }}</span>
          <span class="font-bold text-slate-900">{{ item.nombre }}</span>
          <span class="text-xs text-slate-500 mt-2">{{ item.desc }}</span>
        </button>
        <div class="col-span-full mt-8 flex justify-end">
          <button @click="store.avanzarPaso" :disabled="!store.proyecto.tipoInstalacion" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold disabled:opacity-30">Siguiente</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 2" class="bg-white p-10 rounded-3xl shadow-xl max-w-2xl mx-auto animate-fade-in">
        <div class="grid grid-cols-2 gap-6 mb-8">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-2">Ancho (cm)</label>
            <input type="number" @keydown="bloquearCaracteres" v-model.number="store.proyecto.medidas.ancho" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 ring-blue-500 text-center font-bold text-xl">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-2">Alto (cm)</label>
            <input type="number" @keydown="bloquearCaracteres" v-model.number="store.proyecto.medidas.alto" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 ring-blue-500 text-center font-bold text-xl">
          </div>
        </div>
        
        <p v-if="tieneErrorCritico" class="text-center text-red-500 font-bold mb-4 text-xs uppercase">{{ mensajeErrorMedidas }}</p>
        
        <div class="space-y-3" v-if="!tieneErrorCritico && !medidasIncompletas">
           <label @click="tipoMedida = 'fabricacion'" :class="['flex p-4 border-2 rounded-2xl cursor-pointer transition-all', tipoMedida === 'fabricacion' ? 'border-blue-600 bg-blue-50' : 'border-slate-100']">
             <span class="font-bold text-sm">Medida de Fabricación (Exacta)</span>
           </label>
           <label @click="tipoMedida = 'vano'" :class="['flex p-4 border-2 rounded-2xl cursor-pointer transition-all', tipoMedida === 'vano' ? 'border-blue-600 bg-blue-50' : 'border-slate-100']">
             <span class="font-bold text-sm">Medida de Vano (Hueco de obra)</span>
           </label>
        </div>

        <div class="mt-8 flex justify-between">
          <button @click="store.retrocederPaso" class="font-bold text-slate-400">Regresar</button>
          <button @click="store.avanzarPaso" :disabled="!tipoMedida || tieneErrorCritico || medidasIncompletas" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold disabled:opacity-30 transition-all">Continuar</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 3" class="bg-white p-10 rounded-3xl shadow-xl max-w-2xl mx-auto animate-fade-in">
        <div v-if="store.proyecto.tipoInstalacion === 'cancel'" class="space-y-8 text-center">
          <h3 class="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Tipo de Apertura</h3>
          <div class="flex gap-4">
            <button @click="store.proyecto.detalles.tipoCancel = 'abatible'" :class="['flex-1 p-6 rounded-2xl border-2 font-bold', store.proyecto.detalles.tipoCancel === 'abatible' ? 'border-blue-600 bg-blue-50' : 'border-slate-50']">Abatible 🚪</button>
            <button @click="store.proyecto.detalles.tipoCancel = 'corredizo'" :class="['flex-1 p-6 rounded-2xl border-2 font-bold', store.proyecto.detalles.tipoCancel === 'corredizo' ? 'border-blue-600 bg-blue-50' : 'border-slate-50']">Corredizo ↔️</button>
          </div>

          <div v-if="store.proyecto.detalles.tipoCancel === 'corredizo'" class="animate-fade-in pt-6 border-t space-y-4">
             <h3 class="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Espesor del Vidrio</h3>
             <div class="flex gap-4 justify-center">
               <button v-for="e in ['6mm', '10mm']" :key="e" @click="store.proyecto.detalles.espesor = e; store.proyecto.detalles.sistemaCorredizo = ''" :class="['px-8 py-3 rounded-xl border-2 font-bold', store.proyecto.detalles.espesor === e ? 'border-blue-600 bg-blue-50' : 'border-slate-50']">{{e}}</button>
             </div>
             
             <div v-if="store.proyecto.detalles.espesor" class="pt-4">
                <select v-model="store.proyecto.detalles.sistemaCorredizo" class="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 outline-none ring-2 ring-slate-100 focus:ring-blue-500 appearance-none">
                  <option value="" disabled>Selecciona Sistema</option>
                  <option v-if="store.proyecto.detalles.espesor === '6mm'">Sistema Bruken</option>
                  <option v-if="store.proyecto.detalles.espesor === '6mm'">Sistema Acuario</option>
                  <option v-if="store.proyecto.detalles.espesor === '10mm'">Sistema Bacalar</option>
                  <option v-if="store.proyecto.detalles.espesor === '10mm'">Sistema Libra</option>
                </select>
             </div>
          </div>
        </div>
        <div class="mt-10 flex justify-between">
          <button @click="store.retrocederPaso" class="font-bold text-slate-400">Regresar</button>
          <button @click="store.avanzarPaso" :disabled="paso3Incompleto" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold disabled:opacity-30">Paso Final</button>
        </div>
      </div>

      <div v-else-if="store.pasoActual === 4" class="animate-fade-in">
        <h3 class="text-center font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-6">Selecciona la tecnología del vidrio</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <button v-for="fam in familiasVidrio" :key="fam.id" @click="seleccionarFamilia(fam)"
             :class="['p-4 rounded-2xl border-2 transition-all font-bold text-sm', familiaSeleccionada?.id === fam.id ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-white bg-white text-slate-600 hover:border-slate-200 shadow-sm']">
             {{ fam.nombre }}
           </button>
        </div>

        <div v-if="familiaSeleccionada" class="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 animate-fade-in mb-10 text-center">
           <p class="text-slate-500 text-xs font-medium mb-8 italic">{{ familiaSeleccionada.desc }}</p>
           
           <div class="flex flex-wrap justify-center gap-10">
              <div v-for="v in familiaSeleccionada.variantes" :key="v.nombre" @click="seleccionarVariante(v.nombre)" class="group cursor-pointer flex flex-col items-center">
                 <div :class="[v.clase, 'w-20 h-20 rounded-full shadow-inner ring-offset-4 transition-all duration-300', store.proyecto.tipoVidrio === v.nombre ? 'ring-4 ring-blue-600 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100']"></div>
                 <span :class="['mt-4 text-[10px] font-black uppercase tracking-tighter', store.proyecto.tipoVidrio === v.nombre ? 'text-blue-600' : 'text-slate-400']">{{ v.nombre }}</span>
              </div>
           </div>

           <div class="mt-12 pt-8 border-t border-slate-50">
              <p class="text-[9px] font-bold text-slate-300 uppercase mb-4 tracking-widest">Espesores Disponibles</p>
              <div class="flex justify-center gap-3">
                 <button v-for="esp in familiaSeleccionada.espesores" :key="esp" 
                   @click="store.proyecto.detalles.espesor = esp"
                   :class="['px-6 py-2 rounded-full text-xs font-bold transition-all', store.proyecto.detalles.espesor === esp ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-400']">
                   {{ esp }}
                 </button>
              </div>
           </div>
        </div>

        <div class="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <button @click="store.retrocederPaso" class="font-bold text-slate-400">Regresar</button>
          <a v-if="store.proyecto.tipoVidrio" :href="enlaceWhatsApp" target="_blank" class="bg-[#25D366] text-white px-10 py-4 rounded-2xl font-black italic uppercase tracking-widest shadow-xl hover:scale-105 transition-all">WhatsApp Cotización 📱</a>
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
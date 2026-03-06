import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCotizadorStore = defineStore('cotizador', () => {
  const pasoActual = ref(1)
  
  const proyecto = ref({
    tipoInstalacion: '',
    medidas: {
      ancho: 0,
      alto: 0
    },
    detalles: {
      tipoCancel: '',       
      espesor: '',          
      sistemaCorredizo: '', 
      plantilla: ''         
    },
    tipoVidrio: ''
  })

const avanzarPaso = () => {
    // Si estamos en Medidas (3) y es Puerta o Fijo, saltamos Detalles (4) y vamos a Procesos (5)
    if (pasoActual.value === 3 && ['puerta', 'fijo'].includes(proyecto.value.tipoInstalacion)) {
      pasoActual.value = 5
    } else {
      pasoActual.value++
    }
  }

  const retrocederPaso = () => {
    // Si estamos en Procesos (5) y es Puerta o Fijo, regresamos directo a Medidas (3)
    if (pasoActual.value === 5 && ['puerta', 'fijo'].includes(proyecto.value.tipoInstalacion)) {
      pasoActual.value = 3
    } else if (pasoActual.value > 1) {
      pasoActual.value--
    }
  }

  const reiniciarCotizacion = () => {
    pasoActual.value = 1
    proyecto.value = {
      tipoInstalacion: '',
      medidas: { ancho: 0, alto: 0 },
      detalles: { tipoCancel: '', espesor: '', sistemaCorredizo: '', plantilla: '' },
      tipoVidrio: ''
    }
  }

  return { pasoActual, proyecto, avanzarPaso, retrocederPaso, reiniciarCotizacion }
})
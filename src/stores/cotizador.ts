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
      espesor: '',          // ¡NUEVO! Guardaremos '6mm' o '10mm'
      sistemaCorredizo: '', 
      plantilla: ''         
    },
    tipoVidrio: ''
  })

  const avanzarPaso = () => {
    if (pasoActual.value === 2 && ['puerta', 'fijo'].includes(proyecto.value.tipoInstalacion)) {
      pasoActual.value = 4
    } else {
      pasoActual.value++
    }
  }

  const retrocederPaso = () => {
    if (pasoActual.value === 4 && ['puerta', 'fijo'].includes(proyecto.value.tipoInstalacion)) {
      pasoActual.value = 2
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
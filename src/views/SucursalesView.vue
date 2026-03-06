<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import sucursalesData from '../data/sucursales.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ✅ USAMOS RUTAS ESTÁTICAS PARA EVITAR ERRORES DE BUILD
// Detectamos si estamos en producción para agregar el prefijo de la subcarpeta
const isProd = import.meta.env.PROD
const base = isProd ? '/vixa-web/' : '/'

let DefaultIcon = L.icon({
  iconUrl: `${base}marker-icon.png`,
  shadowUrl: `${base}marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

L.Marker.prototype.options.icon = DefaultIcon
// ------------------------------------

const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

// Función para mover el mapa al hacer clic en la lista
const centrarEnSucursal = (coords: [number, number]) => {
  if (map.value) {
    map.value.setView(coords, 16, { animate: true })
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  // Inicializamos el mapa centrado en Veracruz
  map.value = L.map(mapContainer.value).setView([19.1738, -96.1342], 12)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value)

  // Dibujamos los marcadores desde el JSON
  sucursalesData.forEach(sucursal => {
    const popupContent = `
      <div style="font-family: sans-serif; min-width: 180px;">
        <h3 style="font-weight: 800; color: #1e3a8a; margin-bottom: 4px;">${sucursal.nombre}</h3>
        <p style="font-size: 13px; color: #475569; margin: 0;">${sucursal.direccion}</p>
        <a href="tel:${sucursal.telefonoLink}" style="color: #2563eb; display: block; margin-top: 8px; font-weight: 600; text-decoration: none;">
          📞 ${sucursal.telefonoDisplay}
        </a>
      </div>
    `;

    L.marker(sucursal.coords as [number, number])
      .addTo(map.value!)
      .bindPopup(popupContent)
  })
})
</script>

<template>
  <div class="py-12 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-10">
        <h2 class="text-3xl font-extrabold text-slate-900">Ubicaciones VIXA</h2>
        <p class="text-slate-600 mt-2">Selecciona una sucursal para ver su ubicación exacta.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="sucursal in sucursalesData" 
            :key="sucursal.nombre"
            @click="centrarEnSucursal(sucursal.coords as [number, number])"
            class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all group"
          >
            <h3 class="font-bold text-slate-800 group-hover:text-blue-600">{{ sucursal.nombre }}</h3>
            <p class="text-sm text-slate-500 mt-1">{{ sucursal.direccion }}</p>
            <div class="mt-4 flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>Ubicar en mapa</span>
              <span class="ml-2">→</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 h-[500px] lg:h-[600px] bg-white rounded-2xl shadow-inner border border-slate-200 overflow-hidden relative">
          <div ref="mapContainer" class="w-full h-full z-0"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
/* Estilo para que el scrollbar se vea profesional */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

/* Filtro opcional para que el mapa no sea tan brillante */
.leaflet-container { background: #f8fafc !important; }
</style>
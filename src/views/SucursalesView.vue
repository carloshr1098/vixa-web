<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import sucursalesData from '../data/sucursales.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ✅ CONFIGURACIÓN DE ICONOS (Desde carpeta public)
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

const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

const centrarEnSucursal = (coords: [number, number]) => {
  if (map.value) {
    map.value.setView(coords, 16, { animate: true })
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  map.value = L.map(mapContainer.value).setView([19.1738, -96.1342], 12)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value)

  // 🛠️ RESTAURANDO POPUPS CON LINKS Y TELÉFONOS
  sucursalesData.forEach(sucursal => {
    // Generamos el link de Google Maps usando las coordenadas
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${sucursal.coords[0]},${sucursal.coords[1]}`;

    const popupContent = `
      <div style="font-family: sans-serif; min-width: 200px; padding: 5px;">
        <h3 style="font-weight: 800; color: #1e3a8a; margin: 0 0 5px 0; font-size: 16px;">${sucursal.nombre}</h3>
        <p style="font-size: 13px; color: #475569; margin: 0 0 10px 0; line-height: 1.4;">${sucursal.direccion}</p>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <a href="tel:${sucursal.telefonoLink}" 
             style="background-color: #f1f5f9; color: #1e40af; padding: 8px; border-radius: 6px; text-decoration: none; font-weight: 700; text-align: center; font-size: 13px;">
            📞 Llamar: ${sucursal.telefonoDisplay}
          </a>
          
          <a href="${googleMapsUrl}" target="_blank"
             style="background-color: #1e40af; color: white; padding: 8px; border-radius: 6px; text-decoration: none; font-weight: 700; text-align: center; font-size: 13px;">
            📍 Cómo llegar (Maps)
          </a>
        </div>
      </div>
    `;

    L.marker(sucursal.coords as [number, number])
      .addTo(map.value!)
      .bindPopup(popupContent)
  })

  // Fix para asegurar que el mapa cargue bien el tamaño
  setTimeout(() => { map.value?.invalidateSize() }, 400)
})
</script>

<template>
  <div class="py-12 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <h2 class="text-3xl font-extrabold text-slate-900">Ubicaciones VIXA</h2>
        <p class="text-slate-600 mt-2">Encuentra tu sucursal más cercana y obtén la ruta.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="sucursal in sucursalesData" 
            :key="sucursal.nombre"
            @click="centrarEnSucursal(sucursal.coords as [number, number])"
            class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all group"
          >
            <h3 class="font-bold text-slate-800 group-hover:text-blue-600 text-lg">{{ sucursal.nombre }}</h3>
            <p class="text-sm text-slate-500 mt-1">{{ sucursal.direccion }}</p>
            
            <div class="mt-3 flex items-center text-blue-600 font-semibold text-sm">
              <span class="mr-2">📞</span>
              <span>{{ sucursal.telefonoDisplay }}</span>
            </div>

            <div class="mt-4 flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>Ubicar en mapa</span>
              <span class="ml-2">→</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 h-[500px] lg:h-[600px] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
          <div ref="mapContainer" class="w-full h-full z-0"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.leaflet-popup-content-wrapper { border-radius: 12px; padding: 5px; }
</style>
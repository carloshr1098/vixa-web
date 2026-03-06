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

  // Centramos el mapa inicialmente en un punto medio de Veracruz
  map.value = L.map(mapContainer.value).setView([19.1738, -96.1342], 8)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value)

  sucursalesData.forEach(sucursal => {
    // 1. Procesamos los teléfonos adicionales para el HTML del Popup
    const extrasHTML = sucursal.telefonosAdicionales?.map(tel => `
      <a href="tel:+52${tel.replace(/\s/g, '')}" 
         style="background-color: #f8fafc; color: #334155; padding: 6px; border-radius: 4px; text-decoration: none; font-weight: 600; text-align: center; font-size: 12px; border: 1px solid #e2e8f0;">
        📞 ${tel}
      </a>
    `).join('') || '';

    const popupContent = `
      <div style="font-family: sans-serif; min-width: 220px; padding: 5px;">
        <h3 style="font-weight: 800; color: #1e3a8a; margin: 0 0 5px 0; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
          ${sucursal.nombre}
        </h3>
        <p style="font-size: 12px; color: #64748b; margin: 5px 0 10px 0; line-height: 1.3;">${sucursal.direccion}</p>
        
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Teléfonos:</span>
          <a href="tel:${sucursal.telefonoLink}" 
             style="background-color: #1e40af; color: white; padding: 8px; border-radius: 6px; text-decoration: none; font-weight: 700; text-align: center; font-size: 13px;">
            📞 ${sucursal.telefonoDisplay} (Principal)
          </a>
          ${extrasHTML}
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 5px 0;">
          
          <a href="${sucursal.mapUrl}" target="_blank"
             style="background-color: #10b981; color: white; padding: 8px; border-radius: 6px; text-decoration: none; font-weight: 700; text-align: center; font-size: 13px;">
            📍 Ver ruta en Google Maps
          </a>
        </div>
      </div>
    `;

    L.marker(sucursal.coords as [number, number])
      .addTo(map.value!)
      .bindPopup(popupContent)
  })

  setTimeout(() => { map.value?.invalidateSize() }, 400)
})
</script>

<template>
  <div class="py-12 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 class="text-3xl font-black text-slate-900 tracking-tight">Puntos de Venta VIXA</h2>
          <p class="text-slate-600 mt-2">Contamos con presencia estratégica para atender tus proyectos.</p>
        </div>
        <div class="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
          {{ sucursalesData.length }} Ubicaciones disponibles
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-4 max-h-[650px] overflow-y-auto pr-3 custom-scrollbar">
          <div 
            v-for="sucursal in sucursalesData" 
            :key="sucursal.id"
            @click="centrarEnSucursal(sucursal.coords as [number, number])"
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all group relative overflow-hidden"
          >
            <div class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-blue-600 transition-all"></div>

            <h3 class="font-bold text-slate-800 group-hover:text-blue-700 text-lg mb-1">{{ sucursal.nombre }}</h3>
            <p class="text-xs text-slate-500 mb-4 flex items-start gap-1">
              <span class="mt-0.5">📍</span> {{ sucursal.direccion }}
            </p>
            
            <div class="space-y-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Líneas de atención:</p>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                  {{ sucursal.telefonoDisplay }}
                </span>
                <span 
                  v-for="tel in sucursal.telefonosAdicionales" 
                  :key="tel"
                  class="text-xs font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100"
                >
                  {{ tel }}
                </span>
              </div>
            </div>

            <div class="mt-5 flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ubicar ahora</span>
              <span class="ml-2">→</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 h-[500px] lg:h-[650px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          <div ref="mapContainer" class="w-full h-full z-0"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Personalización de Leaflet para VIXA */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.leaflet-popup-content-wrapper { 
  border-radius: 16px; 
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  padding: 4px;
}
.leaflet-popup-tip { background: white; }
</style>
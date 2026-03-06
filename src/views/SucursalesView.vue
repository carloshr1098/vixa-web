<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import sucursalesData from '../data/sucursales.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ✅ CONFIGURACIÓN DE ICONOS
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
  map.value = L.map(mapContainer.value).setView([19.1738, -96.1342], 8)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value)

  sucursalesData.forEach(sucursal => {
    // 🛠️ GENERADOR DE TELÉFONOS PARA EL POPUP
    const todosLosTels = [sucursal.telefonoDisplay, ...(sucursal.telefonosAdicionales || [])];
    const telsHTML = todosLosTels.map(tel => `
      <a href="tel:+52${tel.replace(/\s/g, '')}" 
         style="display: block; background-color: #f1f5f9; color: #1e40af; padding: 6px; border-radius: 4px; text-decoration: none; font-weight: 600; margin-bottom: 4px; font-size: 12px; text-align: center; border: 1px solid #e2e8f0;">
        📞 ${tel}
      </a>
    `).join('');

    const popupContent = `
      <div style="font-family: sans-serif; min-width: 220px;">
        <h3 style="font-weight: 800; color: #1e3a8a; margin: 0 0 5px 0; font-size: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 4px;">
          ${sucursal.nombre}
        </h3>
        <p style="font-size: 11px; color: #64748b; margin: 8px 0;">📍 ${sucursal.direccion}</p>
        
        <div style="margin-bottom: 10px;">
          <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 4px;">Contacto:</span>
          ${telsHTML}
          <a href="mailto:${sucursal.email}" style="display: block; font-size: 12px; color: #2563eb; text-decoration: underline; margin-top: 5px; font-weight: 500;">
            ✉️ ${sucursal.email}
          </a>
        </div>
        
        <a href="${sucursal.mapUrl}" target="_blank"
           style="display: block; background-color: #10b981; color: white; padding: 8px; border-radius: 6px; text-decoration: none; font-weight: 700; text-align: center; font-size: 12px; margin-top: 10px;">
          🗺️ Abrir en Google Maps
        </a>
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
      
      <div class="mb-10 text-left">
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Sucursales VIXA</h2>
        <p class="text-slate-600">Presencia nacional para tus proyectos de vidrio y aluminio.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-3 custom-scrollbar">
          <div 
            v-for="sucursal in sucursalesData" 
            :key="sucursal.id"
            @click="centrarEnSucursal(sucursal.coords as [number, number])"
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition-all group"
          >
            <h3 class="font-bold text-slate-900 group-hover:text-blue-700 text-lg mb-2">{{ sucursal.nombre }}</h3>
            <p class="text-xs text-slate-500 mb-4 line-clamp-2">📍 {{ sucursal.direccion }}</p>
            
            <div class="flex items-center gap-2 mb-3 text-sm text-blue-600 font-medium">
              <span>✉️</span>
              <span class="truncate">{{ sucursal.email }}</span>
            </div>

            <div class="space-y-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atención telefónica:</p>
              <div class="flex flex-wrap gap-2">
                <span class="text-[11px] font-bold bg-blue-600 text-white px-2 py-1 rounded shadow-sm">
                  {{ sucursal.telefonoDisplay }}
                </span>
                <span 
                  v-for="tel in sucursal.telefonosAdicionales" 
                  :key="tel"
                  class="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200"
                >
                  {{ tel }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 h-[500px] lg:h-[700px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          <div ref="mapContainer" class="w-full h-full z-0"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.leaflet-popup-content-wrapper { border-radius: 16px; padding: 8px; }
</style>
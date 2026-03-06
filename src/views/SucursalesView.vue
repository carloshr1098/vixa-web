<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import sucursalesData from '../data/sucursales.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ✅ CONFIGURACIÓN DE ICONOS PARA VITE/GITHUB PAGES
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
  map.value = L.map(mapContainer.value).setView([19.1738, -96.1342], 7)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value)

  sucursalesData.forEach(sucursal => {
    // 🛠️ GENERADOR DE TELÉFONOS
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
        
        <a href="${sucursal.mapUrl}" target="_blank" style="text-decoration: none; display: block; margin: 10px 0;">
          <p style="font-size: 11px; color: #2563eb; font-weight: 600; margin: 0; line-height: 1.3;">
            📍 ${sucursal.direccion}
            <span style="display: block; font-size: 9px; color: #94a3b8; margin-top: 2px;">(Toca para ver ruta en Maps)</span>
          </p>
        </a>
        
        <div style="margin-top: 10px;">
          <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 4px;">Atención telefónica:</span>
          ${telsHTML}
          <a href="mailto:${sucursal.email}" style="display: block; font-size: 11px; color: #64748b; text-decoration: none; margin-top: 8px; font-weight: 500; text-align: center;">
            ✉️ ${sucursal.email}
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
      
      <div class="mb-10">
        <h2 class="text-3xl font-black text-slate-900 tracking-tight italic">Nuestras Sucursales</h2>
        <p class="text-slate-600 mt-2">Haz clic en la dirección para obtener indicaciones en Google Maps.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-3 custom-scrollbar">
          <div 
            v-for="sucursal in sucursalesData" 
            :key="sucursal.id"
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all group"
          >
            <h3 
              @click="centrarEnSucursal(sucursal.coords as [number, number])"
              class="font-bold text-slate-900 group-hover:text-blue-700 text-lg mb-2 cursor-pointer"
            >
              {{ sucursal.nombre }}
            </h3>
            
            <a 
              :href="sucursal.mapUrl" 
              target="_blank" 
              class="text-xs text-blue-600 hover:text-blue-800 font-medium mb-4 block leading-relaxed"
            >
              📍 {{ sucursal.direccion }}
              <span class="block text-[10px] text-slate-400 font-normal mt-1">(Ver en Google Maps)</span>
            </a>
            
            <div class="flex items-center gap-2 mb-4 text-xs text-slate-500">
              <span>✉️</span>
              <a :href="`mailto:${sucursal.email}`" class="hover:underline">{{ sucursal.email }}</a>
            </div>

            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <a 
                  :href="`tel:${sucursal.telefonoLink}`"
                  class="text-[11px] font-bold bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  {{ sucursal.telefonoDisplay }}
                </a>
                <a 
                  v-for="tel in sucursal.telefonosAdicionales" 
                  :key="tel"
                  :href="`tel:+52${tel.replace(/\s/g, '')}`"
                  class="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 hover:bg-slate-200 transition-colors"
                >
                  {{ tel }}
                </a>
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
.leaflet-popup-content-wrapper { border-radius: 16px; padding: 10px; }
</style>
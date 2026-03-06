<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import sucursalesData from '../data/sucursales.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null) // Usamos shallowRef para mejor rendimiento con objetos de Leaflet

// Función para centrar el mapa cuando el usuario hace clic en la lista lateral
const centrarEnSucursal = (coords: [number, number]) => {
  if (map.value) {
    map.value.setView(coords, 15, { animate: true })
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  // Inicializamos el mapa
  map.value = L.map(mapContainer.value).setView([19.2, -96.5], 8)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value)

  sucursalesData.forEach(sucursal => {
    const telefonosExtraHTML = sucursal.telefonosAdicionales?.length > 0
      ? sucursal.telefonosAdicionales.map((tel: string) => `
          <br>
          <a href="tel:+52${tel.replace(/\s/g, '')}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            ${tel}
          </a>
        `).join('')
      : '';

    const popupContent = `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; min-width: 200px;">
        <h3 style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">${sucursal.nombre}</h3>
        <p style="margin: 0; color: #475569; font-size: 13px;">
          <strong>📞 Tel:</strong> 
          <a href="tel:${sucursal.telefonoLink}" style="color: #2563eb; text-decoration: none;">${sucursal.telefonoDisplay}</a>
          ${telefonosExtraHTML}
        </p>
        <p style="margin-top: 8px; font-size: 12px; color: #64748b;">📍 ${sucursal.direccion}</p>
      </div>
    `;

    L.marker(sucursal.coords as [number, number])
      .addTo(map.value!)
      .bindPopup(popupContent)
  })
})
</script>

<template>
  <div class="py-16 bg-slate-50 min-h-screen font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-12">
        <h2 class="text-4xl font-black text-slate-900 tracking-tight">Presencia en Veracruz</h2>
        <p class="mt-4 text-xl text-slate-600">Visítanos en nuestras plantas de producción y puntos de venta.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        <div class="lg:col-span-1 space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          <div 
            v-for="sucursal in sucursalesData" 
            :key="sucursal.nombre"
            @click="centrarEnSucursal(sucursal.coords as [number, number])"
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{{ sucursal.nombre }}</h3>
            <p class="text-sm text-slate-500 mt-2 mb-4 leading-relaxed line-clamp-2">📍 {{ sucursal.direccion }}</p>
            
            <div class="flex items-center justify-between mt-auto">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">Ver en mapa</span>
              <a :href="sucursal.mapUrl" target="_blank" class="text-slate-400 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 relative h-[500px] lg:h-[600px]">
          <div class="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden z-0">
            <div ref="mapContainer" class="w-full h-full z-0"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
/* Estilos para el Mapa Leaflet */
.leaflet-popup-content-wrapper {
  border-radius: 16px;
  padding: 8px;
}
.leaflet-container {
  font-family: inherit;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
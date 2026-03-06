<script setup lang="ts">
import { onMounted, ref } from 'vue'
import sucursalesData from '../data/sucursales.json'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!mapContainer.value) return

  // Inicializamos el mapa centrado en el estado
  const map = L.map(mapContainer.value).setView([19.2, -96.5], 8)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map)

  // Iteramos el JSON importado
  sucursalesData.forEach(sucursal => {
    
    // Armamos los teléfonos adicionales si existen
// Armamos los teléfonos adicionales si existen
    const telefonosExtraHTML = sucursal.telefonosAdicionales && sucursal.telefonosAdicionales.length > 0
      ? sucursal.telefonosAdicionales.map((tel: string) => `
          <br>
          <a href="tel:+52${tel.replace(/\s/g, '')}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            ${tel}
          </a>
        `).join('')
      : '';

    // Armamos el HTML del globo (Popup) insertando los extras
    const popupContent = `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; min-width: 220px;">
        <h3 style="font-weight: 800; color: #0f172a; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;">
          ${sucursal.nombre}
        </h3>
        
        <p style="margin: 4px 0; color: #475569;">
          <strong>📞 Teléfono(s):</strong><br>
          <a href="tel:${sucursal.telefonoLink}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            ${sucursal.telefonoDisplay}
          </a>
          ${telefonosExtraHTML}
        </p>
        
        <p style="margin: 8px 0; color: #475569;">
          <strong>✉️ Email:</strong><br>
          <a href="mailto:${sucursal.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
            ${sucursal.email}
          </a>
        </p>
        
        <p style="margin-top: 12px; color: #475569;">
          <strong>📍 Dirección:</strong><br>
          <a href="${sucursal.mapUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500; display: inline-block; margin-top: 2px;">
            ${sucursal.direccion}
          </a>
        </p>
      </div>
    `;

    // Renderizamos el marcador y le inyectamos nuestro HTML
    L.marker(sucursal.coords as [number, number])
      .addTo(map)
      .bindPopup(popupContent)
  })
})
</script>

<template>
  <div class="py-12 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-slate-900 tracking-tight">Nuestras Sucursales</h2>
        <p class="mt-4 text-xl text-slate-600">Encuentra tu punto de distribución VIXA más cercano.</p>
      </div>
      
      <div class="bg-slate-50 p-4 rounded-xl shadow-lg border border-slate-200 relative z-0">
        <div ref="mapContainer" class="w-full h-[600px] rounded-lg z-0 relative"></div>
      </div>
    </div>
  </div>
</template>

<style>
.leaflet-default-icon-path {
  background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png');
}
.leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>
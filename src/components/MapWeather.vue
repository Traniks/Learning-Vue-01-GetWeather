<script lang="ts" setup>
import { ref, watch } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

const props = defineProps(['onSelectCoords', 'coords'])
const position = ref(props.coords ?? [55.751244, 37.618423]) // Москва по умолчанию

watch(() => props.coords, (newCoords) => {
    if (newCoords && (newCoords[0] !== position.value[0] || newCoords[1] !== position.value[1])) {
        position.value = newCoords
    }
})

function onMapClick(e: LeafletMouseEvent) {
    position.value = [e.latlng.lat, e.latlng.lng]
    props.onSelectCoords(position.value)
}
</script>

<template>
    <div class="mt-4 rounded-2xl overflow-hidden">
        <LMap style="height: 300px; width: 100%;" :zoom="8" :center="position" @click="onMapClick">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LMarker :lat-lng="position" />
        </LMap>
    </div>
</template>
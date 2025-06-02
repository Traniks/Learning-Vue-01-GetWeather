<script setup>
    defineProps(['weather']);
</script>

<template>
    <div class="mt-5">
        <div v-if="weather" class="border border-white rounded-lg p-4">
            <h2 class="text-xl font-bold mb-2">Погода в {{ weather.name }}</h2>
            <p>Температура: {{ weather.main.temp }}°C</p>
            <p>Погода: {{ weather.weather[0].description }}</p>
            <p>Влажность: {{ weather.main.humidity }}%</p>
            <p>Ветер: {{ weather.wind.speed }} м/с</p>
        </div>
    </div>
</template>
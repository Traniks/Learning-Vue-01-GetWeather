<script setup>
    defineProps(['weather']);
</script>

<template>
    <div class="mt-5">
        <div v-if="weather" class="border border-white rounded-lg p-4">
            <div class="flex items-center justify-center mb-2">
                <img v-if="weather.weather && weather.weather[0]?.icon"
                    :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                    :alt="weather.weather[0].description" class="w-16 h-16" />
            </div>
            <h2 class="text-xl font-bold mb-2">Погода в {{ weather.name }}</h2>
            <p>Температура: {{ weather.main.temp }}°C</p>
            <p>Погода: {{ weather.weather[0].description }}</p>
            <p>Влажность: {{ weather.main.humidity }}%</p>
            <p>Ветер: {{ weather.wind.speed }} м/с</p>
        </div>
    </div>
</template>
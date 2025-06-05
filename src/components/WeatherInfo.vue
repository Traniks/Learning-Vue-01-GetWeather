<script setup>
    defineProps(['weather']);
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n()
</script>

<template>
    <div class="mt-5">
        <div v-if="weather" class="border border-white rounded-lg p-4">
            <div class="flex items-center justify-center mb-2">
                <img v-if="weather.weather && weather.weather[0]?.icon"
                    :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                    :alt="weather.weather[0].description" class="w-16 h-16" />
            </div>
            <h2 class="text-xl font-bold mb-2">{{ t('weatherIn') }} {{ weather.name }}</h2>
            <p>{{ t('temperature') }}: {{ weather.main.temp }}°C</p>
            <p>{{ t('weather') }}: {{ weather.weather[0].description }}</p>
            <p>{{ t('humidity') }}: {{ weather.main.humidity }}%</p>
            <p>{{ t('wind') }}: {{ weather.wind.speed }} {{ t('windUnit') }}</p>
        </div>
    </div>
</template>
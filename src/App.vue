<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

import WeatherForm from './components/WeatherForm.vue'
import WeatherInfo from './components/WeatherInfo.vue'
import ErrorMessage from './components/ErrorMessage.vue'

const city = ref('');
const error = ref(false);
const errorText = ref('');
const weather = ref(null);

const cityDisplay = computed(() => {
	return city.value === '' ? '«Вашем городе»' : `«${city.value}»`
})

function updateCity(val) {
	city.value = val;
}

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

async function getWeather(e) {
	e.preventDefault();

	if (city.value.trim().length < 2) {
		errorText.value = 'Пожалуйста, корректное название города.';
		error.value = true;
		return;
	} else {
		errorText.value = '';
		error.value = false;
	}

	try {
		const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
			params: {
				q: city.value,
				appid: apiKey,
				lang: 'ru',
				units: 'metric'
			}
		});
		weather.value = res.data;
	} catch (e) {
		error.value = true;
		errorText.value = 'Ошибка получения данных о погоде';
		weather.value = null;
	}
}
</script>

<template>
	<section class="w-2/5 mx-auto rounded-4xl bg-gray-800 p-5 text-center text-white">
		<h1 class="text-3xl mt-4">Погодные приложение</h1>
		<p class="text-lg mt-2 mb-4">Узнать погоду в
			<span class="underline decoration-emerald-500">{{ cityDisplay }}</span>
		</p>

		<WeatherForm :city="city.value" :error="error.value" @update:city="updateCity" @submit="getWeather" />
		<ErrorMessage :errorText="errorText" />

		<WeatherInfo :weather="weather" />
	</section>
</template>

<style scoped></style>
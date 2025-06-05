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
const loading = ref(false); // Для спиннера (по желанию)

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
		loading.value = true;
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
	} finally {
		loading.value = false;
	}
}

async function getWeatherByLocation() {
	if (!navigator.geolocation) {
		error.value = true;
		errorText.value = 'Геолокация не поддерживается вашим браузером';
		return;
	}
	
	loading.value = true;
	navigator.geolocation.getCurrentPosition(async (position) => {
		const { latitude, longitude } = position.coords;
		try {
			const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
				params: {
					lat: latitude,
					lon: longitude,
					appid: apiKey,
					lang: 'ru',
					units: 'metric'
				}
			});
			weather.value = res.data;
			city.value = res.data.name;
			error.value = false;
			errorText.value = '';
		} catch (e) {
			error.value = true;
			errorText.value = 'Ошибка получения данных по геолокации';
			weather.value = null;
		} finally {
			loading.value = false;
		}
	}, () => {
		error.value = true;
		errorText.value = 'Не удалось получить геолокацию';
		loading.value = false;
	});
}
</script>

<template>
	<section class="w-2/5 mx-auto rounded-4xl bg-gray-800 p-5 text-center text-white">
		<h1 class="text-3xl mt-4">Погодные приложение</h1>
		<p class="text-lg mt-2 mb-4">Узнать погоду в
			<span class="underline decoration-emerald-500">{{ cityDisplay }}</span>
		</p>

		<WeatherForm :city="city.value" :error="error.value" @update:city="updateCity" @submit="getWeather" />
		<button class="mt-2 mb-4 px-4 py-2 bg-emerald-700 rounded-lg hover:bg-emerald-900 transition-colors"
			@click="getWeatherByLocation" :disabled="loading">
			Определить местоположение
		</button>
		<ErrorMessage :errorText="errorText" />

		<WeatherInfo :weather="weather" />
	</section>
</template>

<style scoped></style>
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
		handleWeatherError(e, false);
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
			handleWeatherError(e, true);
		} finally {
			loading.value = false;
		}
	}, () => {
		error.value = true;
		errorText.value = 'Не удалось получить геолокацию';
		loading.value = false;
	});
}

function handleWeatherError(e, isGeo = false) {
	error.value = true;
	weather.value = null;
	if (e.response) {
		if (e.response.status === 404) {
			errorText.value = isGeo
				? 'Местоположение не найдено.'
				: 'Город не найден. Проверьте правильность написания.';
		} else if (e.response.status === 401) {
			errorText.value = 'Ошибка авторизации. Проверьте API-ключ.';
		} else {
			errorText.value = `Ошибка сервера: ${e.response.status}`;
		}
	} else if (e.request) {
		errorText.value = 'Нет ответа от сервера. Проверьте соединение с интернетом.';
	} else {
		errorText.value = isGeo
			? 'Неизвестная ошибка при получении данных по геолокации.'
			: 'Неизвестная ошибка при получении данных о погоде.';
	}
}
</script>

<template>
	<section class="w-100% max-w-[800px] m-5 p-5 rounded-4xl bg-gray-800 text-center text-white md:w-3/5 xl:w-2/5 md:mx-auto">
		<h1 class="text-xl md:text-3xl mt-4">Погодные приложение</h1>
		<p class="text-base md:text-lg mt-2 mb-4">Узнать погоду в
			<span class="underline decoration-emerald-500">{{ cityDisplay }}</span>
		</p>

		<WeatherForm :city="city.value" :error="error.value" @update:city="updateCity" @submit="getWeather" />
		<button class="my-4 px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
			@click="getWeatherByLocation" :disabled="loading">
			Определить местоположение
		</button>
		<ErrorMessage :errorText="errorText" />

		<WeatherInfo :weather="weather" />
	</section>
</template>

<style scoped></style>
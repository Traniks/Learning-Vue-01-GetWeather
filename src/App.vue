<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

import WeatherForm from './components/WeatherForm.vue'
import WeatherInfo from './components/WeatherInfo.vue'
import ErrorMessage from './components/ErrorMessage.vue'

const { t, locale } = useI18n()

const city = ref('');
const error = ref(false);
const errorText = ref('');
const weather = ref(null);
const loading = ref(false); // Для спиннера (по желанию)

const cityDisplay = computed(() => {
	return city.value === '' ? `«${t('yourCity')}»` : `«${city.value}»`
})

function updateCity(val) {
	city.value = val;
}

const isDark = ref(false)
function toggleTheme() {
	isDark.value = !isDark.value
	document.documentElement.classList.toggle('dark', isDark.value)
}

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

async function getWeather(e) {
	e.preventDefault();

	const cityPattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/u;
	if (city.value.trim().length < 2 || !cityPattern.test(city.value)) {
		errorText.value = t('invalidCity');
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
		errorText.value = t('geoNotSupported');
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
		errorText.value = t('geoDenied');
		loading.value = false;
	});
}

function handleWeatherError(e, isGeo = false) {
	error.value = true;
	weather.value = null;
	if (e.response) {
		if (e.response.status === 404) {
			errorText.value = isGeo
				? t('geoNotFound')
				: t('cityNotFound');
		} else if (e.response.status === 401) {
			errorText.value = t('apiError');
		} else {
			errorText.value = t('serverError', { status: e.response.status });
		}
	} else if (e.request) {
		errorText.value = t('noResponse');
	} else {
		errorText.value = isGeo
			? t('geoUnknown')
			: t('unknown');
	}
}
</script>

<!-- TODO:
3)Погода по клику на карте -->

<template>
	<section
		class="w-100% max-w-[800px] m-5 p-5 rounded-4xl bg-gray-800 text-center text-white md:w-3/5 xl:w-2/5 md:mx-auto dark:bg-gray-800 dark:shadow-xl dark:ring dark:ring-gray-900/5">

		<div class="w-full flex gap-3 justify-end">
			<button @click="locale = locale === 'ru' ? 'en' : 'ru'"
				class="px-2 py-1 bg-gray-700 rounded cursor-pointer">
				{{ locale === 'ru' ? 'EN' : 'RU' }}
			</button>
			<button @click="toggleTheme" class="px-2 py-1 bg-gray-700 rounded cursor-pointer">
				{{ isDark ? '🌙' : '☀️' }}
			</button>
		</div>

		<h1 class="text-xl md:text-3xl mt-4">{{ t('title') }}</h1>
		<p class="text-base md:text-lg mt-2 mb-4">{{ t('weatherIn') }}
			<span class="underline decoration-emerald-500">{{ cityDisplay }}</span>
		</p>

		<WeatherForm :city="city.value" :error="error.value" @update:city="updateCity" @submit="getWeather"
			:input-placeholder="t('inputPlaceholder')" :button-text="t('getWeather')" />
		<button class="my-4 px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
			@click="getWeatherByLocation" :disabled="loading">
			{{ t('location') }}
		</button>
		<ErrorMessage :errorText="errorText" />

		<WeatherInfo :weather="weather" />
	</section>
</template>

<style scoped></style>
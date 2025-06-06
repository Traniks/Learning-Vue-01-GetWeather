<script setup>
import { useI18n } from 'vue-i18n'

import WeatherForm from './components/WeatherForm.vue'
import WeatherInfo from './components/WeatherInfo.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import MapWeather from './components/MapWeather.vue'

const { t, locale } = useI18n()

import { useWeatherStore } from '@/stores/weather'
const weatherStore = useWeatherStore()
</script>

<template>
	<section
		class="w-100% max-w-[800px] m-5 p-5 rounded-4xl bg-gray-800 text-center text-white md:w-3/5 xl:w-2/5 md:mx-auto dark:bg-gray-800 dark:shadow-xl dark:ring dark:ring-gray-900/5">

		<div class="w-full flex gap-3 justify-end">
			<button @click="locale = locale === 'ru' ? 'en' : 'ru'"
				class="px-2 py-1 bg-gray-700 rounded cursor-pointer">
				{{ locale === 'ru' ? 'EN' : 'RU' }}
			</button>
			<button @click="weatherStore.toggleTheme" class="px-2 py-1 bg-gray-700 rounded cursor-pointer">
				{{ weatherStore.isDark ? '🌙' : '☀️' }}
			</button>
		</div>

		<h1 class="text-xl md:text-3xl mt-4">{{ t('title') }}</h1>
		<p class="text-base md:text-lg mt-2 mb-4">{{ t('weatherIn') }}
			<span class="underline decoration-emerald-500">{{ weatherStore.cityDisplay }}</span>
		</p>

		<WeatherForm 
			:city="weatherStore.city" 
			:error="weatherStore.error" 
			@update:city="weatherStore.updateCity"
			@submit="weatherStore.getWeather" 
			:input-placeholder="t('inputPlaceholder')"
			:button-text="t('getWeather')" 
		/>

		<button class="my-4 px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
			@click="weatherStore.getWeatherByLocation" :disabled="weatherStore.loading">
			{{ t('location') }}
		</button>
		<ErrorMessage :errorText="weatherStore.errorText" />

		<WeatherInfo :weather="weatherStore.weather" />
		<MapWeather :onSelectCoords="weatherStore.getWeatherByCoords" :coords="weatherStore.mapCoords" />
	</section>
</template>

<style scoped></style>
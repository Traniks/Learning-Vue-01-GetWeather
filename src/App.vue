<script setup>
import { ref, computed } from 'vue'

const city = ref('');
const error = ref(false);
const errorText = ref('');
const weather = ref(null);

const cityDisplay = computed(() => {
	return city.value === '' ? '«Вашем городе»' : `«${city.value}»`
})

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
		const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.value)}&appid=${apiKey}&lang=ru&units=metric`);
		if (!res.ok) throw new Error('Город не найден');
		const data = await res.json();
		weather.value = data;
	} catch (e) {
		error.value = true;
		errorText.value = 'Ошибка получения данных о погоде';
		weather.value = null;
	}
}
</script>

<!-- TODO: 
1) Переписать на axios, 
2) Добавить иконки погоды, 
3) Добавить анимацию при загрузке данных
4) Разбить на компоненты -->

<template>
	<section class="w-2/5 mx-auto rounded-4xl bg-gray-800 p-5 text-center text-white">
		<h1 class="text-3xl mt-4">Погодные приложение</h1>
		<p class="text-lg mt-2 mb-4">Узнать погоду в
			<span class="underline decoration-emerald-500">{{ cityDisplay}}</span>
		</p>

		<form class="flex items-center w-full justify-between gap-5" @submit.prevent="getWeather">
			<input type="text"
				class="text border transition duration-300 border-white rounded-lg p-2 w-full outline-emerald-700 focus:outline-3"
				v-model="city" placeholder="Введите город" />
			<button type="submit" :disabled="error"
				class="w-[200px] px-2 py-3 bg-emerald-500 rounded-2xl hover:bg-emerald-700 transition-colors duration-300 cursor-pointer disabled:opacity-60">Получить
				данные</button>
		</form>
		<p class="text-red-600">{{ errorText }}</p>

		<div class="mt-5">
			<div v-if="weather" class="border border-white rounded-lg p-4">
				<h2 class="text-xl font-bold mb-2">Погода в {{ weather.name }}</h2>
				<p>Температура: {{ weather.main.temp }}°C</p>
				<p>Погода: {{ weather.weather[0].description }}</p>
				<p>Влажность: {{ weather.main.humidity }}%</p>
				<p>Ветер: {{ weather.wind.speed }} м/с</p>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
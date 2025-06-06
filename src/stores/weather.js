import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchWeatherByCity, fetchWeatherByCoords } from '@/stores/weatherApi.js'
import { useI18n } from 'vue-i18n'

export const useWeatherStore = defineStore('weather', () => {
	const { t, locale } = useI18n()

	const city = ref('')
	const error = ref(false)
	const errorCode = ref('')

	const weather = ref(null)
	const loading = ref(false)
	const mapCoords = ref([55.751244, 37.618423])
	const apiKey = import.meta.env.VITE_WEATHER_API_KEY

	const cityDisplay = computed(() => {
		return city.value === '' ? `«${t('yourCity')}»` : `«${city.value}»`
	})
	
	const errorText = computed(() =>
		errorCode.value ? t(errorCode.value) : ''
	)

	function updateCity(val) {
		city.value = val
		error.value = false
		errorCode.value = ''
	}

	async function getWeather(e) {
		if (e) e.preventDefault()
		const cityPattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/u
		if (city.value.trim().length < 2 || !cityPattern.test(city.value)) {
			errorCode.value = 'invalidCity'
			error.value = true
			return
		} else {
			errorCode.value = ''
			error.value = false
		}
		try {
			loading.value = true
			const res = await fetchWeatherByCity(
				city.value,
				apiKey,
				locale.value
			)
			weather.value = res.data
			mapCoords.value = [res.data.coord.lat, res.data.coord.lon]
		} catch (e) {
			handleWeatherError(e, false)
		} finally {
			loading.value = false
		}
	}

	async function getWeatherByCoords(coords) {
		loading.value = true
		error.value = false
		errorCode.value = ''
		try {
			const res = await fetchWeatherByCoords(
				coords[0],
				coords[1],
				apiKey,
				locale.value
			)
			weather.value = res.data
			city.value = res.data.name
			mapCoords.value = coords
		} catch (e) {
			handleWeatherError(e, true)
		} finally {
			loading.value = false
		}
	}

	async function getWeatherByLocation() {
		if (!navigator.geolocation) {
			error.value = true
			errorCode.value = 'geoNotSupported'
			return
		}
		loading.value = true
		navigator.geolocation.getCurrentPosition(
			async position => {
				const { latitude, longitude } = position.coords
				try {
					const res = await fetchWeatherByCoords(
						latitude,
						longitude,
						apiKey,
						locale.value
					)
					weather.value = res.data
					city.value = res.data.name
					error.value = false
					errorCode.value = ''
					mapCoords.value = [latitude, longitude]
				} catch (e) {
					handleWeatherError(e, true)
				} finally {
					loading.value = false
				}
			},
			() => {
				error.value = true
				errorCode.value = 'geoDenied'
				loading.value = false
			}
		)
	}

	function handleWeatherError(e, isGeo = false) {
		error.value = true
		weather.value = null
		if (e.response) {
			if (e.response.status === 404) {
				errorCode.value = isGeo ? 'geoNotFound' : 'cityNotFound'
			} else if (e.response.status === 401) {
				errorCode.value = 'apiError'
			} else {
				errorCode.value = 'serverError'
			}
		} else if (e.request) {
			errorCode.value = 'noResponse'
		} else {
			errorCode.value = isGeo ? 'geoUnknown' : 'unknown'
		}
	}

	const isDark = ref(false)
	function toggleTheme() {
		isDark.value = !isDark.value
		document.documentElement.classList.toggle('dark', isDark.value)
	}

	return {
		city,
		error,
		errorText,
		weather,
		loading,
		mapCoords,
		cityDisplay,
		isDark,
		updateCity,
		getWeather,
		getWeatherByCoords,
		getWeatherByLocation,
		toggleTheme,
	}
})

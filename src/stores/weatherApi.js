import axios from 'axios'

export async function fetchWeatherByCity(city, apiKey, lang = 'ru') {
	return await axios.get('https://api.openweathermap.org/data/2.5/weather', {
		params: {
			q: city,
			appid: apiKey,
			lang,
			units: 'metric',
		},
	})
}

export async function fetchWeatherByCoords(lat, lon, apiKey, lang = 'ru') {
	return axios.get('https://api.openweathermap.org/data/2.5/weather', {
		params: {
			lat,
			lon,
			appid: apiKey,
			lang,
			units: 'metric',
		},
	})
}

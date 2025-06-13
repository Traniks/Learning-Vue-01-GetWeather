import axios from 'axios'

export async function fetchWeatherByCity(
	city: string,
	apiKey: string,
	lang: string = 'ru'
) {
	return await axios.get('https://api.openweathermap.org/data/2.5/weather', {
		params: {
			q: city,
			appid: apiKey,
			lang,
			units: 'metric',
		},
	})
}

export async function fetchWeatherByCoords(
	lat: number,
	lon: number,
	apiKey: string,
	lang: string = 'ru'
) {
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

import axios from 'axios';

const API_KEY = '51676197-587b7604ca68e3bcd271cfabc';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
    const params = {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 15,
        page,
    };

    const response = await axios.get(BASE_URL, { params });
    return response.data;
}
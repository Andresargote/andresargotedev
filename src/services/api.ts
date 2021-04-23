import axios from 'axios';

const api = axios.create({
    baseURL: 'https://alblanco-api.herokuapp.com/'
});

export default api;
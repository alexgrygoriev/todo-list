import axios from 'axios';

export const HTTP = axios.create({
    baseURL: "http://[::1]:3000"
})
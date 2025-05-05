import axios from "axios"

const baseUrl = import.meta.env.VITE_API_URL ||
    'VITE_API_URL=https://collectic.propulsion-learn.ch/backend/api/'

export const api = axios.create({
    baseURL: baseUrl
})

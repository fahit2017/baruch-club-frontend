import axios from 'axios';

const API_URL = 'http://localhost:8765/api/events';

export const getAllEvents = () => {
    return axios.get(API_URL);
};

export const getEventById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createEvent = (event) => {
    return axios.post(API_URL, event);
};

export const updateEvent = (id, event) => {
    return axios.put(`${API_URL}/${id}`, event);
};

export const deleteEvent = (id) => {
    return axios.delete(`${API_URL}/${id}`);
}; 
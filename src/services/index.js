import axios from 'axios';

// Base URL for the API Gateway
const API_URL = 'http://localhost:8765/api';

// Generic API functions
export const get = (endpoint) => {
    return axios.get(`${API_URL}${endpoint}`);
};

export const post = (endpoint, data) => {
    return axios.post(`${API_URL}${endpoint}`, data);
};

export const put = (endpoint, data) => {
    return axios.put(`${API_URL}${endpoint}`, data);
};

export const del = (endpoint) => {
    return axios.delete(`${API_URL}${endpoint}`);
};

// Student Service
export const getAllStudents = () => get('/students');
export const getStudentById = (id) => get(`/students/${id}`);
export const createStudent = (student) => post('/students', student);
export const updateStudent = (id, student) => put(`/students/${id}`, student);
export const deleteStudent = (id) => del(`/students/${id}`);

// Club Service
export const getAllClubs = () => get('/clubs');
export const getClubById = (id) => get(`/clubs/${id}`);
export const createClub = (club) => post('/clubs', club);
export const updateClub = (id, club) => put(`/clubs/${id}`, club);
export const deleteClub = (id) => del(`/clubs/${id}`);

// Event Service
export const getAllEvents = () => get('/events');
export const getEventById = (id) => get(`/events/${id}`);
export const createEvent = (event) => post('/events', event);
export const updateEvent = (id, event) => put(`/events/${id}`, event);
export const deleteEvent = (id) => del(`/events/${id}`); 
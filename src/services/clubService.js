import axios from 'axios';

const API_URL = 'http://localhost:8765/api/clubs';

export const getAllClubs = () => {
    return axios.get(API_URL);
};

export const getClubById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createClub = (club) => {
    return axios.post(API_URL, club);
};

export const updateClub = (id, club) => {
    return axios.put(`${API_URL}/${id}`, club);
};

export const deleteClub = (id) => {
    return axios.delete(`${API_URL}/${id}`);
}; 
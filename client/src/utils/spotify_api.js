import axios from 'axios';

const apiBase = 'http://localhost:8080/api';

export const fetchAccessToken = (code) => {
  return axios.get(`${apiBase}/auth/callback?code=${code}`).then(response => response.data);
};

export const fetchCurrentlyPlaying = (accessToken) => {
  return axios.get(`${apiBase}/music/currently-playing?access_token=${accessToken}`).then(response => response.data);
};

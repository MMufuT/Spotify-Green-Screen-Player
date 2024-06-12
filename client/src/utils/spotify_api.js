import axios from 'axios';
const apiBase = 'http://localhost:8080/api';
const clientId = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET



export const fetchAccessToken = (code) => {
  return axios.get(`${apiBase}/auth/callback?code=${code}`).then(response => response.data);
};

export const fetchCurrentlyPlaying = (accessToken) => {
  return axios.get(`${apiBase}/music/currently-playing?access_token=${accessToken}`).then(response => response.data);
};

export const fetchRefreshToken = async () => {

  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const url = "https://accounts.spotify.com/api/token";
  console.log('testing refresh:', refreshToken)
  console.log('testing clientId:', clientId)

   const payload = {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     body: new URLSearchParams({
       grant_type: 'refresh_token',
       refresh_token: refreshToken,
       client_id: clientId,
       client_secret: clientSecret
     }),
   }
   const body = await fetch(url, payload);
   const response = await body.json();
   console.log(response)

   localStorage.setItem('spotify_access_token', response.access_token);
 }

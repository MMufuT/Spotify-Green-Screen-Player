
const express = require('express')
const musicRouter = express.Router()
const request = require('request');

// Endpoint to get currently playing track
musicRouter.get('/currently-playing', (req, res) => {
    const access_token = req.query.access_token;
    const options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
  
    request.get(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        res.json(body);
      }
    });
  });

  module.exports = musicRouter
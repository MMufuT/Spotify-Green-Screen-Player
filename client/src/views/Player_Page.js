import React, { useEffect, useState } from 'react';
import { fetchAccessToken, fetchCurrentlyPlaying } from '../utils/spotify_api';
import useSpotifyPlayer from '../components/use_spotify_player';
import Visualizer from '../components/audio_visualizer';
import LinearProgress from '@mui/material/LinearProgress';


const SpotifyPlayer = () => {
  const [track, setTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  // Directly access localStorage here might cause issues if token is not yet set.
  const [token, setToken] = useState(() => localStorage.getItem('spotify_access_token'));

  useEffect(() => {
    const initializePlayer = async () => {
      if (!token) {
        console.log('no token')
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        if (code) {
          console.log('we have a code', code)
          try {
            const { access_token } = await fetchAccessToken(code);
            localStorage.setItem('spotify_access_token', access_token);
            setToken(access_token);
            const trackInfo = await fetchCurrentlyPlaying(access_token);
            setTrack(trackInfo.item);
            setProgress(trackInfo.progress_ms);
            setDuration(trackInfo.duration_ms);
          } catch (error) {
            console.error('Error fetching access token or track info:', error);
          }
        } else {
          window.location.href = 'http://localhost:8080/api/auth/login';
        }
      } else {
        try {
          console.log('we have a token', token)
          const trackInfo = await fetchCurrentlyPlaying(token);
          console.log(trackInfo)
          setTrack(trackInfo.item);
          setProgress(trackInfo.progress_ms);
          setDuration(trackInfo.item.duration_ms);
        } catch (error) {
          console.error('Error fetching currently playing track:', error);
        }
      }
    };

    initializePlayer();
  }, [token]);

  useEffect(() => {
    // Start updating progress every second once progress is fetched
    if (progress > 0 && duration > 0) {
      const intervalId = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1000);
      }, 1000);

      if (progress >= duration - 500) {
        window.location.reload()
      }

      // Cleanup function to clear the interval
      return () => clearInterval(intervalId);
    }

  }, [progress, duration]); // Depend on progress and duration to restart the timer if needed

  useSpotifyPlayer(token, setTrack, setProgress, setDuration);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'green',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto' // Add scroll if content overflows
    }}>
      {track ? (
        <>
          <img src={track.album.images[1].url} alt={track.name} style={{borderRadius: '30px',}} />
          <h2>{track.name}</h2>
          <h3>{track.artists.map(artist => artist.name).join(', ')}</h3>
          <div>
            {/* <progress value={progress} max={duration}></progress> */}
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={(progress / duration) * 100}
              sx={{
                borderRadius: '8px', height: 10, width: 400, backgroundColor: '#F3BDFF',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#DA7CF2'
                }
              }} />
            {/* <p>{Math.floor(progress / 1000)} / {Math.floor(duration / 1000)} seconds</p> */}
          </div>
          <Visualizer />
        </>
      ) : <div></div>}
    </div>
  );
};

export default SpotifyPlayer;

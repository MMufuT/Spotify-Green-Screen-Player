import React, { useEffect, useState } from 'react';
import { fetchAccessToken, fetchCurrentlyPlaying, fetchRefreshToken } from '../utils/spotify_api';
import useSpotifyPlayer from '../components/use_spotify_player';
import Visualizer from '../components/audio_visualizer';
import LinearProgress from '@mui/material/LinearProgress';
const apiBase = 'http://localhost:8080/api';


const SpotifyPlayer = () => {
    const [track, setTrack] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('spotify_access_token'));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('spotify_refresh_token'));

    useEffect(() => {
        document.title = "Green Screen Spotify Player"
    })

    useEffect(() => {
        const initializePlayer = async () => {
            if (!accessToken) {
                console.log('no token')
                const query = new URLSearchParams(window.location.search);
                const code = query.get('code');
                if (code) {
                    try {
                        const { access_token, refresh_token } = await fetchAccessToken(code);
                        localStorage.setItem('spotify_access_token', access_token);
                        localStorage.setItem('spotify_refresh_token', refresh_token);
                        setAccessToken(access_token);
                        setRefreshToken(refresh_token);
                        const trackInfo = await fetchCurrentlyPlaying(access_token);
                        setTrack(trackInfo.item);
                        setProgress(trackInfo.progress_ms);
                        setDuration(trackInfo.duration_ms);
                    } catch (error) {
                        console.error('Error fetching access token or track info:', error);
                    }
                } else {
                    window.location.href = `${apiBase}/auth/login`;
                }
            } else {
                try {
                    const trackInfo = await fetchCurrentlyPlaying(accessToken);
                    setTrack(trackInfo.item);
                    setProgress(trackInfo.progress_ms);
                    setDuration(trackInfo.item.duration_ms);
                } catch (error) {
                    console.error('Error fetching currently playing track:', error);
                }
            }
        };

        initializePlayer();
    }, [accessToken]);

    useEffect(() => {
        // Refresh token every 30 minutes
        const refreshInterval = setInterval(async () => {
            try {
                await fetchRefreshToken();
                const newAccessToken = localStorage.getItem('spotify_access_token');
                setAccessToken(newAccessToken);
            } catch (error) {
                console.error('Error refreshing access token:', error);
            }
        }, 1800000); // 30 mins in ms


        // Cleanup interval on component unmount
        return () => clearInterval(refreshInterval);
    }, [refreshToken]);

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

    useSpotifyPlayer(accessToken, setTrack, setProgress, setDuration);

    return (
        <div className="fixed-container">
            {!track ? (
                <div></div> // Placeholder during loading
            ) : (
                <>
                    <img src={track.album.images[1].url} alt={track.name} />
                    <h2>{track.name}</h2>
                    <h3>{track.artists.map(artist => artist.name).join(', ')}</h3>
                    <div className="visualizer-container">
                        <Visualizer />
                    </div>
                    <div className="progress-bar-container">
                        <LinearProgress
                            color="secondary"
                            variant="determinate"
                            value={(progress / duration) * 100}
                            sx={{
                                borderRadius: '8px',
                                height: 10,
                                width: '90%',
                                backgroundColor: '#ffc9ea',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#ff80ce'
                                }
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default SpotifyPlayer;

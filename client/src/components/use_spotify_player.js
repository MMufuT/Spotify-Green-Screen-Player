import { useEffect } from 'react';

const useSpotifyPlayer = (accessToken, setTrack, setProgress, setDuration) => {

  function isAudioContextSupported() {
    return!!window.AudioContext ||!!window.webkitAudioContext;
  }
  
  let audioContext
  let analyser

  useEffect(() => {
    if (!isAudioContextSupported()) {
      console.error("Your environment does not support the Web Audio API.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
     .then(stream => {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
      })
     .catch(err => {
        console.error('Error accessing the microphone:', err);
      });

    return () => {
      // Clean up on component unmount
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []); 

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(accessToken); }
      });

      player.addListener('player_state_changed', state => {
        if (state) {
          setTrack(state.track_window.current_track);
          setProgress(state.position);
          setDuration(state.duration);
        }
      });

      player.connect();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken, setTrack, setProgress, setDuration]);

};

export default useSpotifyPlayer
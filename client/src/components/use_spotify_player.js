import { useEffect, useRef } from 'react';

const useSpotifyPlayer = (accessToken, setTrack, setProgress, setDuration) => {

  function isAudioContextSupported() {
    return!!window.AudioContext ||!!window.webkitAudioContext;
  }
  
  const canvasRef = useRef(null);
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
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      
  
      function drawWaveform() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#fff'; // Change fill color to white
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff'; // Change stroke color to white
        ctx.beginPath();

        let sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
          let v = dataArray[i];

          let y = (v * canvas.height) / 255;

          if(i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
      }
  
      drawWaveform(); // Initial draw
      setInterval(drawWaveform, 100); // Redraw every 100ms
    }
  }, [canvasRef.current]); // Dependency on canvasRef.current

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
import React, { useState, useEffect } from 'react';
import { LiveAudioVisualizer } from 'react-audio-visualize';

const Visualizer = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false); // State to track if recording has started


  useEffect(() => {
    async function setupRecorder() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const options = { mimeType: "audio/webm" }; // Specify the MIME type if needed
        const recorder = new MediaRecorder(stream, options);

        setMediaRecorder(recorder);

        
      } catch (err) {
        console.error("Failed to get user media:", err);
      }
    }

    setupRecorder();

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!isRecording && mediaRecorder) {
      startRecording();
    }
  }, [isRecording, mediaRecorder]);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  return (
    <div style={{ margin: '-100px' }}>
      {mediaRecorder && (
        <LiveAudioVisualizer
          mediaRecorder={mediaRecorder}
          width={550}
          height={400}
          barColor='#DA7CF2'
        />
      )}
    </div>
  );
};

export default Visualizer;
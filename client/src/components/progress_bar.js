import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

export const ProgressBar = (value, maxValue) => {
  
    // Normalize the progress value based on the total duration (maxValue)
    const normalizedValue = (value / maxValue) * 100;
  
    return (
      <React.Fragment>
        <LinearProgress  value={normalizedValue} />
      </React.Fragment>
    );
  }
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
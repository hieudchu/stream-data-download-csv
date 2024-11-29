import React from 'react';
import { Button, CircularProgress, Box, LinearProgress, Typography } from '@mui/material';

interface DownloadButtonProps {
  onDownload: () => Promise<void>;
  downloading: boolean;
  progress: number;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  onDownload, 
  downloading,
  progress 
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Button
        variant="contained"
        onClick={onDownload}
        disabled={downloading}
        startIcon={downloading && <CircularProgress size={20} color="inherit" />}
      >
        {downloading ? 'Downloading...' : 'Download CSV'}
      </Button>
      
      {downloading && (
        <Box sx={{ width: '200px' }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="center">
            {Math.round(progress)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};
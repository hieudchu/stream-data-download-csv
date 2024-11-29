import { useState } from 'react';

export const useDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadUsers = async () => {
    setDownloading(true);
    setProgress(0);
    
    try {
      const response = await fetch('/api/middle-download');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get reader');
      }

      const chunks: BlobPart[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(decoder.decode(value, { stream: true }));
        receivedLength += value.length;

        // Calculate progress based on number of records
        const currentContent = chunks.join('');
        const recordCount = (currentContent.match(/\n/g) || []).length;
        const estimatedProgress = Math.min((recordCount / 1000) * 100, 100);
        setProgress(estimatedProgress);

        // Add artificial delay to show progress
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const blob = new Blob(chunks, { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setProgress(100);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setProgress(0);
      }, 500);
    }
  };

  return {
    downloading,
    progress,
    downloadUsers
  };
};
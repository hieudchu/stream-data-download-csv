import React from 'react';
import {
  Box,
  Typography,
  Pagination
} from '@mui/material';
import { UserTable } from '../components/UserTable';
import { DownloadButton } from '../components/DownloadButton';
import { useUsers } from '../hooks/useUsers';
import { useDownload } from '../hooks/useDownload';

export default function Home() {
  const { users, page, setPage, totalPages, loading } = useUsers();
  const { downloading, progress, downloadUsers } = useDownload();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Users Table</Typography>
        <DownloadButton 
          onDownload={downloadUsers} 
          downloading={downloading}
          progress={progress}
        />
      </Box>

      <UserTable users={users} loading={loading} />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
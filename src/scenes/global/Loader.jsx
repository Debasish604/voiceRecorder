import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: '#fff',
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.secondary.main, // Customize the loader color
}));

const SimpleBackdrop = ({ open, handleClose ,size = 80 }) => {
  return (
    <StyledBackdrop open={open} onClick={handleClose}>
      <StyledCircularProgress size={size} />
    </StyledBackdrop>
  );
};

export default SimpleBackdrop;

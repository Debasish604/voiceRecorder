import React, { useState } from 'react';

// import Button from '@mui/material/Button';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContentText from '@mui/material/DialogContentText';
// import Grow from '@mui/material/Grow';
// import { tokens } from "../../theme";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, useTheme } from "@mui/material";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ChatboxCustom from './chatbox-custom';

const GlobalDialog = (props) => {
  return (
    <Box m="20px">
      <Dialog
        open={props.openDialog}
        onClose={props.onCloseDialog}
        aria-labelledby="responsive-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="false"
      >
        <div style={{ width: "100%", minHeight: '550px' }} id='chatDiv'>
          <DialogTitle id="responsive-dialog-title">
            {"Chat"}
            <IconButton onClick={props.onCloseDiolog} style={{ position: "absolute", top: "0", right: "0", color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ backgroundColor: '#fff' }}>
            <div>
              <ChatboxCustom />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </Box>
  );
};

export default GlobalDialog;

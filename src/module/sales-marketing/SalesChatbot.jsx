import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import CustomSalesChatbot from '../../components/chat-bot/SalesChatbot';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function SalesChatbot(props) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div >
            <BootstrapDialog
                open={props.openDialog}
                onClose={props.onCloseDialog}
                aria-labelledby="customized-dialog-title"
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Chat
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={props.onCloseDiolog}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    < CustomSalesChatbot />
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
}

export default SalesChatbot;

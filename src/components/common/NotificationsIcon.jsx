import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@mui/material/Tooltip';

import { faBell, faVolumeUp, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';
import ringer from "./flipdish-ringer.mp3";
import '../../index.css'

const NotificationIcon = (props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio(ringer));


    const handleIconClick = () => {
        if (isPlaying) {
            audio.pause();
        }
        else {
            audio.loop = true;
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        setIsPlaying(true);
        handleIconClick()
        // Cleanup audio on component unmount

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [audio]);


    return (
        <Box sx={{ display: 'flex', cursor: 'pointer',position:'absolute', zIndex:999}}>
            <Box sx={{ marginRight: 2 }}>
            <Tooltip title="Anomaly Details" arrow>
                    <FontAwesomeIcon onClick={props.onClickBellicon} icon={faBell}  
                    className='blinking-icon' />
                </Tooltip>
            </Box>
            <Box sx={{ marginRight: 2 }}>
                <FontAwesomeIcon
                    icon={isPlaying ? faVolumeUp : faVolumeXmark}
                    // size={20}
                    onClick={handleIconClick}
                    className='sound-color'
                />
            </Box>
        </Box>
    );
}


export default NotificationIcon;

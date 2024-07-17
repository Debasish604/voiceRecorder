import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const GlobalCard = ({ title, subtitle, increase, units, currency, tooltipContent, benchmark }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const formattedSubtitle = subtitle !== null ? subtitle.toLocaleString() : 'Loading...';

  const UpArrow = <FontAwesomeIcon style={{ paddingTop: '2px', marginLeft: '10px', color: '#4cceac' }} icon={faCaretUp} size="2xl" />
  const DownArrow = <FontAwesomeIcon style={{ marginTop: '-2px', marginLeft: '10px', color: '#F47791' }} icon={faCaretDown} size="2xl" />

  return (
    <Box
      width="100%"
      // m="4%"
      p={1}
      backgroundColor={colors.primary[400]}
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      sx={{':hover': {transform: 'scale(1.05)'}}}
      borderRadius={'10px'}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign={'center'}
          sx={{ color: colors.grey[100] }}
        >
          {title}
        </Typography> &nbsp; &nbsp;

        {/* Tooltip with InfoIcon on the right side of the title */}
        {tooltipContent && (
          <Tooltip title={tooltipContent} arrow placement="top" >
            <InfoOutlinedIcon
              fontSize="small"
              style={{ cursor: 'pointer', marginLeft: '5px' }}
            />
          </Tooltip>
        )}

      </Box>
      <Box display="flex" justifyContent="center" mt="6px">
        <Typography variant="h4" fontWeight="bold" sx={{ color: benchmark === 'low' ? 'red' : colors.greenAccent[500] }}>
          {currency}&nbsp;
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ color: benchmark === 'low' ? 'red' : colors.greenAccent[500] }}>
          {formattedSubtitle}
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ color: benchmark === 'low' ? 'red' : colors.greenAccent[500] }}>
          &nbsp;{units}

        </Typography>

        {benchmark === 'high' ? (UpArrow) : ''}
        {benchmark === 'low' ? (DownArrow) : ''}

        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default GlobalCard;

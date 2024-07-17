
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Box,useTheme,Typography } from '@mui/material';
import { tokens } from "../../theme";
import '../../style/GlobalStyle.css';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';


function DonutCharts(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { series, labels, height, tilesLables, flag } = props;
  

  return (
    <Box sx={{ flexGrow: 1 }} className='sekeltonContainer'>
      <h6>{tilesLables}</h6>
      {labels.length > 0 && series.length > 0  ?  (
        <Chart
          options={{
            chart: {
              type: 'donut',
              foreColor: colors.grey[100],
            },
            labels: labels,
          }}
          series={series}
          type="donut"
          height={height}
        />
      ) : (
        <Typography variant="body1" color="textSecondary" className='dataLoader'>
        {flag == 0 ? (
            <Box sx={{ position: 'relative' }} >
                <CircularProgress
                    variant="determinate"
                    sx={{
                        color: (theme) =>
                            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                    }}
                    size={40}
                    thickness={4}
                    {...props}
                    value={100}
                />
                <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    sx={{
                        color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                        animationDuration: '550ms',
                        position: 'absolute',
                        left: 0,
                        [`& .${circularProgressClasses.circle}`]: {
                            strokeLinecap: 'round',
                        },
                    }}
                    size={40}
                    thickness={4}
                    {...props}
                />
            </Box>
        ) : (

            <h2>Data Not Available</h2>
        )
        }

      </Typography>
      )}
    </Box>
  );

}

export default DonutCharts;

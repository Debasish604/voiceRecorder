
import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
import { tokens } from "../../theme";
import { Box,useTheme,Typography } from '@mui/material';
import '../../style/GlobalStyle.css';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';

function PieCharts(props) {
  const { series, labels, height,tilesLables,flag } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  


  return (
    <Box sx={{ flexGrow: 1 }} className='sekeltonContainer'>
    <h6>{tilesLables}</h6>
      
      { series.length > 0 ? (
        <Chart
          options={{
            chart: {
              type: 'pie',
              foreColor: colors.grey[100],
            },
            labels: labels,
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                  
    
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          }}
          series={series}
          type="pie"
          height={height}
        />
      ):(
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


export default PieCharts;

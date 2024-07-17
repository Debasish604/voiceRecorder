import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import '../../style/GlobalStyle.css';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';

function LineChart(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { labels, series, height, tilesLables, flag } = props;
  console.log('Line labels ', labels );
  console.log('Line series ', series );

  
  const [lineChartData, setLineChartData] = useState(series);

  useEffect(() => {
    if (labels.length > 0 && series.length > 0) {
      setLineChartData(series);
      // console.log('series in us',series);
  }
  }, [labels, series]);

  const xAxisPlotLines = [
    {
      // value: labels.length, // Adjust the position based on your data
      color: 'black',               
      dashArray: 5  ,
      width: 200   ,           
    }
  ];

  const horizontalLineY = 2;
  const horizontalLineX = 2;

  return (
    <Box sx={{ flexGrow: 1 }} className='sekeltonContainer'>
      <h6>{tilesLables}</h6>
      {labels.length > 0 && series.length > 0 ? (
        <Chart
          options={
            {
            chart: {
              height: 50,
              type: 'line',
              zoom: {
                enabled: false
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [5, 7, 5],
              curve: 'straight',
              dashArray: [0, 8, 5]
            },
            title: {
              align: 'left'
            },
            legend: {
              tooltipHoverFormatter: function (val, opts) {
                const value = opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex].toFixed(2);
                return val + ' - <strong>' + value + '</strong>';
              }
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6
              }
            },
            xaxis: {
              labels: {
                style: {
                  colors: colors.grey[100],
                  // colors:'red',
                  // plotLines: xAxisPlotLines,
                },
              },
              categories: labels,
            },


            annotations: {
              xaxis: [
                {
                  x: 0, 
                  x2: labels.length, 
                  y: horizontalLineY,
                }
              ],

              yaxis: [
                {
                  x: 0, 
                  x2: labels.length,
                  x: horizontalLineX,
                }
              ]
            },

            tooltip: {
             
              y: [
                {
                  title: {
                    formatter: function (val) {
                      return val
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                }
              ],

              

            },
            grid: {
              borderColor: '#f1f1f1',
            },
            
          }
        }
          series={lineChartData}
          type="line"
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
                  animationDuration: '1250ms',
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
          )
            : (
              <h2>Data Not Available</h2>
            )
          }
        </Typography>
      )}
    </Box>
  );
}

export default LineChart;
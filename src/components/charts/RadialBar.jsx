import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Box, Typography } from '@mui/material';
import '../../style/GlobalStyle.css';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';

function RadialBarChart(props) {


  // const {series_data, tilesLables, flag} = props

  // console.log('series_data is in',series_data);
  const [radialBarChart, setRadialBarChart] = useState({
    series: [],
    options: {
      chart: {
        height: 390,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            }
          }
        }
      },
      colors: ['#1ab7ea', '#0084ff'],
      labels: ['Stockout Rate', 'Target Stock Rate'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 40,
        offsetY: 30,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
        },
        itemMargin: {
          vertical: 3
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }]
    },



  });



  useEffect(() => {
    // Convert percentage value to a number
    const seriesData = parseFloat(props.series_data);
    if (!isNaN(seriesData)) {
      setRadialBarChart((prevChart) => ({
        ...prevChart,
        series: [seriesData, 97],
      }));
    }
  }, [props.series_data]);

  return (
    <Box sx={{ flexGrow: 1 }} className='sekeltonContainer'>
      <h6>{props.tilesLables}</h6>
      {props.series_data && props.series_data.length > 0 ? (
        <Chart
          options={radialBarChart.options}
          series={radialBarChart.series}
          type="radialBar"
          height={350}
        />
      ) : (
        <Typography variant="body1" color="textSecondary" className='dataLoader'>
                    {props.flag == 0 ? (
                        <Box sx={{ position: 'relative' }} >
                            <CircularProgress
                                variant="determinate"
                                sx={{
                                    color: (theme) =>
                                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                                }}
                                size={40}
                                thickness={4}
                                {...props.series_data}
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
                                {...props.series_data}
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

export default RadialBarChart;

import React from 'react'
import Chart from "react-apexcharts";
import { Box, useTheme, Typography } from "@mui/material";
import NotificationIcon from '../common/NotificationsIcon';
import { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import '../../style/GlobalStyle.css';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Chatbot from '../chat-bot';

function ColumnChart(props) {
    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    const { labels, series, height, legend, format_func, tilesLables, notificationStatus,salesChat ,flag } = props;
    const [onDialogOpen, setOnDialogOpen] = useState(false);
    
    const [barData, setBarData] = useState({
        series: [{
            name: '',
            data: series
        }]
    });
    const onClickBellIcon = async (event) => {
        setOnDialogOpen(true);
        console.log('Column chart-----------------');
     };
   const onCloseDialog = async (event) => {
       setOnDialogOpen(false);
       // setNotificationDialogOpen((prevOpen) => !prevOpen);
   };

    useEffect(() => {
        if (labels.length > 0 && series.length > 0) {

            setBarData({
                series: [{
                    name: '',
                    data: series
                }]
            });
        }
    }, [labels, series]);

    // const formatNumber = (value) => {

    //     return (value / 1000000).toFixed(3) + 'M';


    // };
    // const formatNumberWithCommas = (value) => {
    //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
    return (
        <Box sx={{ flexGrow: 1 }} className='sekeltonContainer' position='relative'>
            <h6>{tilesLables}</h6>
            {/* {notificationStatus == true ? (<div style={{zIndex:99999}}><NotificationIcon  onClickBellicon={onClickBellIcon} /></div>) : null} */}
            {notificationStatus == true ? (
                <div style={{zIndex:99999}}>
                    <NotificationIcon  onClickBellicon={onClickBellIcon} />
                    <Chatbot openDialog={onDialogOpen} onCloseDiolog={onCloseDialog} />
                </div>
            ) : null
            }
            {series.length > 0 ? (
                <Chart
                    options={
                        {
                            chart: {
                                type: 'bar',
                            },
                            plotOptions: {
                                bar: {
                                    borderRadius: 4,
                                    dataLabels: {
                                        position: 'top', // top, center, bottom
                                    },
                                }
                            },
                            dataLabels: {
                                enabled: true,
                                formatter: function (val) {
                                    return val + "%";
                                },
                                offsetY: -20,
                                style: {
                                    fontSize: '12px',
                                    colors: [color.grey[100]]
                                }
                            },

                            stroke: {
                                width: 2
                            },
                            grid: {
                                show: false
                            },
                            xaxis: {
                                labels: {
                                    style: {
                                        colors: color.grey[100],
                                    },
                                },
                                categories: labels,
                                tickPlacement: 'on',
                                position: 'bottom',
                                axisBorder: {
                                    show: false
                                },
                                axisTicks: {
                                    show: false
                                },
                                crosshairs: {
                                    fill: {
                                        type: 'gradient',
                                        gradient: {
                                            colorFrom: '#D8E3F0',
                                            colorTo: '#BED1E6',
                                            stops: [0, 100],
                                            opacityFrom: 0.4,
                                            opacityTo: 0.5,
                                        }
                                    }
                                },

                            },
                            yaxis: {
                                axisBorder: {
                                    show: false
                                },
                                axisTicks: {
                                    show: false,
                                },
                                labels: {
                                    show: false,
                                    formatter: function (val) {
                                        return val + "%";
                                    },
                                    style: {
                                        colors: color.grey[100],
                                    },
                                }

                            },
                            tooltip: {
                                y: {
                                    formatter: format_func
                                }, theme: "dark"
                            }
                        }
                    }
                    series={barData.series}
                    type="bar"
                    height={height}
                />) : (
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
export default ColumnChart;
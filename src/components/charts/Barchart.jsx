import React from 'react'
import Chart from "react-apexcharts";
import { Box, useTheme, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { tokens } from "../../theme"
import '../../style/GlobalStyle.css';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import NotificationIcon from '../common/NotificationsIcon';
import Chatbot from '../chat-bot';
import SalesChatbot from '../../module/sales-marketing/SalesChatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FaRocketchat } from "react-icons/fa";
// import { LuPiggyBank } from "react-icons/lu";
import Tooltip from '@mui/material/Tooltip';

function BarCharts(props) {
    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    const { labels, series, height, width,legend, format_func, format_Tooltip, tilesLables, flag, notificationStatus } = props;
    const [barData, setBarData] = useState({
        series: [{
            name: '',
            data: series
        }]
    });

    const [onDialogOpen, setOnDialogOpen] = useState(false);


    const onClickBellIcon = async (event) => {
        setOnDialogOpen(true);
    };
    const onCloseDialog = async (event) => {
        setOnDialogOpen(false);
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

    return (
        <Box sx={{ flexGrow: 1 }} className='sekeltonContainer' position='relative'>
            <h6>{tilesLables}</h6>
            {notificationStatus == true ? (
                <div style={{ zIndex: 99 }}>
                    <Tooltip title="Chat with KPI" arrow>
                        <FontAwesomeIcon onClick={onClickBellIcon} icon={faCommentDots} className='chat-icon' size="lg" />
                    </Tooltip>
                    <SalesChatbot openDialog={onDialogOpen} onCloseDiolog={onCloseDialog} />
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
                                    columnWidth: '50%',
                                }
                            },
                            dataLabels: {
                                enabled: false
                            },

                            stroke: {
                                width: 2
                            },
                            grid: {
                                show: false
                            },
                            xaxis: {
                                labels: {
                                    // rotate: -45,
                                    style: {
                                        colors: color.grey[100],
                                    },
                                },
                                categories: labels,
                                tickPlacement: 'on',

                            },
                            yaxis: {
                                title: {
                                    text: legend,
                                    style: {
                                        color: color.grey[100],
                                        // fontSize: '12px',
                                        fontFamily: 'Arial, sans-serif',
                                    },
                                },
                                labels: {
                                    formatter: format_func,
                                    style: {
                                        colors: color.grey[100],
                                    },
                                },
                            },
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shade: 'light',
                                    type: "horizontal",
                                    shadeIntensity: 0.25,
                                    gradientToColors: undefined,
                                    inverseColors: true,
                                    opacityFrom: 0.85,
                                    opacityTo: 0.85,
                                    stops: [50, 0, 100]
                                },
                            },
                            tooltip: {
                                y: {
                                    formatter: format_Tooltip
                                }, theme: "dark"
                            }
                        }
                    }
                    series={barData.series}
                    type="bar"
                    height={height}
                    width={width}
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
export default BarCharts;
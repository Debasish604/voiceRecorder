import React from 'react'
import Chart from "react-apexcharts";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import '../../style/GlobalStyle.css';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import SalesChatbot from '../../module/sales-marketing/SalesChatbot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
function DistributedColumnChart(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { labels, series, height, legend, format_func, format_Tooltip, tilesLables, flag, notificationStatus,width } = props;

    // console.log(' labels',labels);
    // console.log(' series',series);
    // console.log(' flag',flag);


    const [distributedColumnChart, setDistributedColumnChart] = useState({
        series: [{
            name: '',
            data: series
        }]
    }
    );

    const [onDialogOpen, setOnDialogOpen] = useState(false);


    const onClickBellIcon = async (event) => {
        setOnDialogOpen(true);
    };
    const onCloseDialog = async (event) => {
        setOnDialogOpen(false);
    };
    useEffect(() => {
        if (labels.length > 0 && series.length > 0) {
            setDistributedColumnChart({
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
            {/* <FontAwesomeIcon  icon={faCommentDots}     className='blinking-icon' /> */}
            {/* {notificationStatus ? (
                <div style={{ zIndex: 99 }}>
                    <Tooltip title="Chat with KPI" arrow>
                        <SalesChatbot openDialog={onDialogOpen} onCloseDiolog={onCloseDialog} />
                    </Tooltip>
                    <FontAwesomeIcon onClick={onClickBellIcon} icon={faCommentDots} className='chat-icon' size="lg" />
                </div>
            ) : null
            } */}

            {notificationStatus == true ? (
                <div style={{ zIndex: 99 }}>
                    <Tooltip title="Chat with KPI" arrow>
                        <FontAwesomeIcon onClick={onClickBellIcon} icon={faCommentDots} className='chat-icon' size="lg" />
                    </Tooltip>
                    <SalesChatbot openDialog={onDialogOpen} onCloseDiolog={onCloseDialog} />
                </div>
            ) : null
            }
            {labels.length > 0 && series.length > 0 ? (
                <Chart
                    options={{
                        chart: {
                            // height: 350,
                            type: 'bar',
                            // events: {
                            //     click: function (chart, w, e) {
                            //     }
                            // }
                        },
                        grid: {
                            show: false
                        },
                        // colors: colors,
                        plotOptions: {
                            bar: {
                                columnWidth: '45%',
                                distributed: true,
                                borderRadius: 4
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        legend: {
                            show: false
                        },
                        xaxis: {
                            categories: labels,
                            labels: {
                                style: {
                                    colors: colors.grey[100],
                                },
                            },
                        },
                        yaxis: {
                            title: {
                                text: legend,
                                style: {
                                    color: colors.grey[100],
                                    fontSize: '10px',
                                    fontFamily: 'Arial, sans-serif',
                                },
                            },
                            labels: {
                                formatter: format_func,
                                style: {
                                    colors: colors.grey[100],
                                }
                            },
                        },
                        tooltip: {
                            y: {
                                // formatter: (value) => { return value.toFixed(2) }
                                formatter: format_Tooltip,
                            }, theme: "dark"
                        }
                    }}
                    series={distributedColumnChart.series}
                    type="bar"
                    height={height}
                />
            ) : (
                <Typography variant="body1" color="textSecondary" className='dataLoader'>
                    {flag == 0 ? (
                        <Box sx={{ position: 'relative' }}  >
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
export default DistributedColumnChart;
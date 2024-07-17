import React from 'react'
import Chart from "react-apexcharts";
import { Box, useTheme } from "@mui/material";
import { useState, useEffect } from 'react';
import { tokens } from "../../theme"
import '../../index.css'

function StackedColumnChart(props) {
    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    const { labels, series, height ,legend} = props;
    const [barData, setBarData] = useState({ series: series });

    useEffect(() => {
        if (labels.length > 0 && series.length > 0) {
            setBarData({ series: series });
        }
    }, [labels, series]);

    const formatNumberWithCommas = (value) => {
        // if (value >= 1000000000000) {
        //     return (value / 1000000000000).toFixed(1) + 'T';
        // } else if (value >= 1000000000) {
        //     return (value / 1000000000).toFixed(1) + 'B';
        // } else if (value >= 1000000) {
        //     return (value / 1000000).toFixed(1) + 'M';
        // } else if (value >= 1000) {
        //     return (value / 1000).toFixed(1) + 'K';
        // } else {
        //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // }

        // return value + '₹';

        return (value / 100000000 ).toFixed(4) + 'M';

    };

    const formatNumberWithCommasTooltip = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {labels.length > 0 && series.length > 0 && (
                <Chart
                    options={{
                        chart: {
                            type: 'bar',
                            stacked: true,
                        },
                        plotOptions: {
                            bar: {
                                borderRadius: 2,
                                columnWidth: '100%',
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            formatter: formatNumberWithCommas,
                            // offsetY: -20,
                            style: {
                                fontSize: '10px',
                                colors: [color.grey[100]]
                            }
                        },
                        xaxis: {
                            categories: labels,
                            labels: {
                                style: {
                                    colors: color.grey[100],
                                },
                            },
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
                                // show: false,
                                formatter: formatNumberWithCommas,
                                style: {
                                    colors: color.grey[100],
                                },
                            }
                        },
                        grid: {
                            show: false
                        },

                        // legend: {
                        //     colors: [color.grey[100]], // Set legend colors here
                        // },
                        legend: {
                            show: false,
                            // position: 'bottom',
                            // offsetY: 40,
                            colors: [color.grey[100]], // Set legend colors here
                        },
                        tooltip: {
                            y: {
                                formatter: formatNumberWithCommasTooltip
                            }, theme: "dark"
                        }
                    }}
                    series={barData.series}
                    type="bar"
                    height={height}
                // className="custom-chart"
                />
            )}
        </Box>
    );
}
export default StackedColumnChart;



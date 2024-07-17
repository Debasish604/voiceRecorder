import React from 'react';
import Chart from 'react-apexcharts';
import { tokens } from "../../theme";
import { Box, useTheme } from "@mui/material";

const LineChartWithAnnotations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const formatNumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const chartOptions = {
    chart: {
      id: 'line-chart',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct'],
      labels: {
        style: {
          colors: colors.grey[100],
        },
      }
    },
    yaxis: {
      labels: {
        formatter: formatNumberWithCommas,
        style: {
          colors: colors.grey[100],
        }
      },
    },
    grid: {
      show: false
    },
    annotations: {
      points: [
        {
          x: 'Mar',
          y: 75,
          marker: {
            size: 8,
            fillColor: '#ff0000',
            strokeColor: '#e68a00',
            radius: 2,
            cssClass: 'apexcharts-custom-class',
          },
          label: {
            borderColor: '#FF4560',
            offsetY: 0,
            style: {
              color: colors.grey[100],
              background: '#cc2900',
            },
            text: 'Very High',
          },
        },
        {
          x: 'Jun',
          y: 25,
          marker: {
            size: 8,
            fillColor: '#ff0000',
            strokeColor: '#e68a00',
            radius: 2,
            cssClass: 'apexcharts-custom-class',
          },
          label: {
            borderColor: '#008FFB',
            offsetY: 0,
            style: {
              color: colors.grey[100],
              background: '#cc2900',
            },
            text: 'Very Low',
          },
        },
      ],
    },
    markers: {
      size: 6,
      fillColor: '#009900',
      strokeColor: '#009900',
      // radius: 2,
    },
    tooltip: {
      y: {
        formatter: (value) => { return value.toFixed(2) }
      }, theme: "dark"
    }
  };

  const chartSeries = [
    {
      name: '',
      data: [30, 40, 75, 50, 49, 25, 70,45,39,55],
    },
  ];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="line"
      width="750"
      height="400"
    />
  );
};

export default LineChartWithAnnotations;

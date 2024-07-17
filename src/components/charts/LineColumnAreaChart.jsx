import React from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme } from '@mui/material';
import { tokens } from "../../theme";

function LineColumnAreaChart({ series, labels, height }) {
  const theme = useTheme();
  const color = tokens(theme.palette.mode);

  // Function to format numbers with commas
  const formatNumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
     
      {series && labels && (
        <Chart
          options={{
            chart: {
              height: 350,
              type: 'line',
              stacked: false,
            },
            stroke: {
              width: [0, 2, 5],
              curve: 'smooth',
            },
            grid: {
              show: false,
            },
            fill: {
              opacity: [0.85, 0.25, 1],
              gradient: {
                inverseColors: false,
                shade: 'light',
                type: 'vertical',
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100],
              },
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
                text: 'Points',
              },
              min: 0,
              labels: {
                formatter: formatNumberWithCommas,
                style: {
                  colors: color.grey[100],
                },
              },
            },
            markers: {
              size: 0,
            },
            tooltip: {
              y: {
                formatter: formatNumberWithCommas,
              },
              theme: 'dark',
            },

            //     formatter: (value) => { return value.toFixed(2) }
            //   }, theme: "dark"
            // }

          }}
          series={series}
          type="line"
          height={height}
        />
      )}
    </Box>
  );
}

export default LineColumnAreaChart;

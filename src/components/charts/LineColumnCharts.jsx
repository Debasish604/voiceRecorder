import React from 'react'
import Chart from "react-apexcharts";
import { Box } from "@mui/material";
import { useState } from 'react';
function LineColumnCharts(props) {
  const [lineColumnChartsData, setLineColumnCharts] = useState({
    series: [
      {
        name: 'Inventory Level',
        type: 'column',
        data: [1000, 1200, 900, 1100, 800, 1000, 950, 1050, 1200, 1100, 950, 1000],
      },
      {
        name: 'Orders Shipped',
        type: 'line',
        data: [20, 25, 18, 22, 15, 20, 23, 28, 25, 20, 22, 18],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        // text: 'Total Sales Volume (Quantity)',
        style: {
          fontSize: '14px',
          color: '#00ffea',
        },
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      grid: {
        show: false
      },
      xaxis: {
        type: 'category',
      },
      yaxis: [
        {
          title: {
            text: 'Inventory Level',

          },

        },
        {
          opposite: true,
          title: {
            text: 'Orders Shipped',

          },
        },
      ],
      tooltip: {
        y: {
          formatter: (value) => { return value.toFixed(2) }
        }, theme: "dark"
      }
    },
  }
  )
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Chart
        options={lineColumnChartsData.options}
        series={lineColumnChartsData.series}
        type="line"
        height={props.height}
      />
    </Box>
  );
}
export default LineColumnCharts;
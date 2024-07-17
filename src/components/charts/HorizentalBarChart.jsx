import React from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { tokens } from "../../theme"
function HorizentalBarChart(props) {
  const theme = useTheme();
  const color = tokens(theme.palette.mode);
  const { labels, series, height, legend, format_func } = props;
  const [barData, setHBarData] = useState({ series: [{ name: '', data: series }] });

  useEffect(() => {
    if (labels.length > 0 && series.length > 0) {
      setHBarData({
        series: [{
          name: '',
          data: series
        }]
      });
    }

  }, [labels, series]);

  return (
    <Box sx={{ flexGrow: 1 }}>

      {labels.length > 0 && series.length > 0 && (
        <Chart
          options={{
            chart: {
              height: height,
              type: 'bar',
            },
            grid: {
              show: false,
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: true,
              },
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: labels,
              labels: {
                formatter: format_func,
                style: {
                  colors: color.grey[100],
                },
              },
              title: {
                text: legend,
                style: {
                  color: color.grey[100],
                  fontSize: '12px',
                  fontFamily: 'Arial, sans-serif',
                }
              },

            },
            yaxis: {

              labels: {
                style: {
                  colors: color.grey[100],
                },
              },
              // min: 0,
              title: {
                style: {
                  color: color.grey[100],
                  fontSize: '12px',
                  fontFamily: 'Arial, sans-serif',
                },
              },

            },
            tooltip: {
              y: {
                formatter: format_func,
              },
              theme: 'dark',
            },
            fill: {
              opacity: 1,
              gradient: {
                inverseColors: false,
                shade: 'light',
                type: 'horizontal',
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100],
              },
            },
            stroke: {
              width: 0,
            },
          }}
          series={barData.series}
          type="bar"
          height={height}
        />
      )}
    </Box>
  );

  // )

  // const handleClickDashboard = (event, chartContext, config) => {
  //     // Access the data point clicked
  //     const { seriesIndex, dataPointIndex } = config;
  //     // Example: Log the clicked data point
  //     console.log('Clicked data point:', barData.series[seriesIndex].data[dataPointIndex]);
  //     // Example: Filter data based on the clicked data point
  //     // const newData = [...barData.series[seriesIndex].data];
  //     // Modify newData based on your filtering logic

  //     // Update the state with the filtered data
  //     // setBarData({
  //     //   ...barData,
  //     //   series: [{
  //     //     data: newData,
  //     //   }],
  //     // });
  //   };

  // return (
  //     <Box sx={{ flexGrow: 1 }}>
  //         <Chart
  //             // options={barData.options}
  //             options={{
  //                 ...barData.options,
  //                 chart: {
  //                   ...barData.options.chart,
  //                   events: {
  //                     click: props.handleOnBarChartClick,
  //                   },
  //                 },
  //                 plotOptions: {
  //                   ...barData.options.plotOptions,
  //                   bar: {
  //                     ...barData.options.plotOptions.bar,
  //                     distributed: true,
  //                   },
  //                 },
  //               }}
  //             series={barData.series}
  //             type="bar"
  //             height={props.height}
  //         />
  //     </Box>
  // );
  // >>>>>>> rabiul
}

export default HorizentalBarChart;

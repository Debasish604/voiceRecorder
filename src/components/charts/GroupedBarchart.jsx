import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ReactApexChart from 'react-apexcharts';

const ChartContainer = styled('div')({
  width: '100%', // Set the desired width
  margin: '0 auto', // Center the chart horizontally
});


class GroupedBarchart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [{
        data: [44, 55, 41, 64, 22, 43, 21]
      }, {
        data: [53, 32, 33, 52, 13, 44, 32]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 430
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        tooltip: {
          shared: true,
          intersect: false
        },
        xaxis: {
          categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        },
      },


    };
  }



  render() {
    return (


      <div id="chart">
      
        <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={430} />
      </div>
    );
  }
}

export default GroupedBarchart;

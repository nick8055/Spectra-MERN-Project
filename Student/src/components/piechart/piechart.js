import './piechart.css'
import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import {Pie} from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

function ChartApp({data1, data2, pietitle}){
    const data = {
        labels: ['Open', 'Expired'],
        datasets: [
            {
                data : [data1, data2],
                backgroundColor : [ '#0052cc','rgb(156, 0, 0)']

            }
        ]
    }

    const options = {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.labels[tooltipItem.index] || '';
    
              if (label) {
                label += ': ';
              }
              label += Math.round(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] * 100) / 100;
              return label;
            },
          },
        },
      };


    return(
        <div className='chartApp'>
            <h1 className='pieTitle'>{pietitle}</h1>
            <Pie style={{backgroundColor:'white'}} data={data} options={options}></Pie>
            <div className='label'>CURRENT OPENINGS - {data1}</div>
            <div className='label'>EXPIRED - {data2}</div>
        </div>
    )
};

export default ChartApp;
import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/';
import HC_exporting from 'highcharts/modules/exporting';
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);

@Component({
  selector: 'app-guage',
  templateUrl: './guage.component.html',
  styleUrls: ['./guage.component.scss'],
})
export class GuageComponent implements OnInit {
  @Input() data: any = { tankID: '', liters: '', height: '' };
  chartOptions: any = {};

  Highcharts = Highcharts;
  testString: number = 0;

  constructor() {}

  ngOnInit(): void {
    console.log('from guage: ', this.data);

    const tankID: any = this.data.tankID;
    const litres: any = +this.data.liters;
    const waterLevel: any = +this.data.waterLevel;
    const tempreture: any = +this.data.tempreture;
    const ullage: any = +this.data.ullage;
    const total: any = Math.floor(+this.data.liters + +this.data.height);
    console.log('from guage litres: ', litres);
    console.log('from guage total: ', total);
    this.chartOptions = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },

      title: {
        text: 'Tank' + tankID,
      },

      subtitle: {
        text:
          '<div style="color:black">Litres:  ' +
          litres +
          '<br/><br/>MM: 0.00<span></span><br/><br/>Water: ' +
          waterLevel +
          '<br/><br/>Temperature: ' +
          tempreture +
          '<br/><br/>Ullage: ' +
          ullage +
          '</div>',
        // verticalAlign: 'top',
        x: 200,
        // y: 10,
        // text: 'TEST',
        verticalAlign: 'middle',
        // floating: true,
      },

      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [
          {
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#FFF'],
                [1, '#333'],
              ],
            },
            borderWidth: 0,
            outerRadius: '109%',
          },
          {
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#333'],
                [1, '#FFF'],
              ],
            },
            borderWidth: 1,
            outerRadius: '107%',
          },
          {
            // default background
          },
          {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%',
          },
        ],
      },

      // the value axis
      yAxis: {
        min: 0,
        max: 50000,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto',
        },
        title: {
          // text: 'km/h',
        },
        plotBands: [
          {
            from: 0,
            to: 20000,
            color: '#55BF3B', // green
          },
          {
            from: 20000,
            to: 45000,
            color: '#DDDF0D', // yellow
          },
          {
            from: 45000,
            to: 50000,
            color: '#DF5353', // red
          },
        ],
      },
      exporting: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },

      series: [
        {
          // name: 'Speed',
          data: [litres],
          // tooltip: {
          //   valueSuffix: ' km/h',
          // },
        },
      ],
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }
}

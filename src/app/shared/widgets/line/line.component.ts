import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-widget-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit, OnChanges {
  @Input() data = [];
  @Input() title = '';

  chartOptions: any = {};

  Highcharts = Highcharts;

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      title: {
        text: this.title,
      },

      yAxis: {
        title: {
          text: 'Sales',
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Sales Hour',
        },
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 0,
        },
      },

      exporting: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },

      series: this.data,

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions = {
      title: {
        text: this.title,
      },

      yAxis: {
        title: {
          text: 'Sales',
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Sales Hour',
        },
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 1,
        },
      },

      exporting: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },

      series: this.data,

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }
}

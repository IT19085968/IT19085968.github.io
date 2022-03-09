import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-widget-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit, OnChanges {
  @Input() data = [];
  @Input() categories = [];
  chartOptions: any = {};

  Highcharts = Highcharts;

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Efficiency Optimization by Branch',
      },
      xAxis: {
        categories: this.categories,
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: 'Total Height',
          },
        },
        // {
        //   title: {
        //     text: 'Profit (millions)',
        //   },
        //   opposite: true,
        // },
      ],
      legend: {
        shadow: false,
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 0,
        },
      },
      exporting: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      series: this.data,
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Tank Information',
      },
      xAxis: {
        categories: this.categories,
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: 'Total Height',
          },
        },
      ],
      legend: {
        shadow: false,
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 0,
        },
      },
      exporting: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      series: this.data,
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);

    console.log('from column: ', this.data);
    console.log('from column cat: ', this.categories);
  }
}

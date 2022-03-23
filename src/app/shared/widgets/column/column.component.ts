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
  @Input() colours = [];
  @Input() title = '';
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
        text: this.title,
      },
      xAxis: {
        categories: this.categories,
        crosshair: true,
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: 'Sales',
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
          pointPadding: 0.2,
          borderWidth: 0,
          colorByPoint: true,
        },
      },
      colors: this.colours,
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
        text: this.title,
      },
      xAxis: {
        categories: this.categories,
        crosshair: true,
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: 'Sales',
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
          pointPadding: 0.2,
          borderWidth: 0,
          colorByPoint: true,
        },
      },
      colors: this.colours,
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
}

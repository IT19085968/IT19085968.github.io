import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';

@Component({
  selector: 'app-widget-tank',
  templateUrl: './tank.component.html',
  styleUrls: ['./tank.component.scss'],
})
export class TankComponent implements OnInit, OnChanges {
  @Input() uppeLimit = '';
  @Input() litres = '';
  @Input() caption = '';

  dataSource: any = {};
  dataFormat: any = 'JSON';
  width: any = '100%';
  height: any = 350;
  type: any = 'cylinder';
  stylesClass: string = '';

  chartOptions = {};

  constructor() {}

  ngOnInit(): void {
    this.dataSource = {
      chart: {
        caption: this.caption,
        lowerlimit: '0',
        upperlimit: this.uppeLimit,
        lowerlimitdisplay: 'Empty',
        upperlimitdisplay: 'Full',
        numbersuffix: ' ltrs',
        cylfillcolor: '#5D62B5',
        plottooltext: 'LPG Consumption: <b>' + this.litres + ' ltrs</b>',
        cylfillhoveralpha: '85',
        theme: 'fusion',
        plotBackgroundColor: 'blue',
        raphaelgroupfillcolor: '#ffffff',
      },
      value: this.litres,
    };

    setTimeout(() => {
      this.stylesClass = 'stylesC';
    }, 60000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = {
      chart: {
        caption: this.caption,
        lowerlimit: '0',
        upperlimit: this.uppeLimit,
        lowerlimitdisplay: 'Empty',
        upperlimitdisplay: 'Full',
        numbersuffix: ' ltrs',
        cylfillcolor: '#5D62B5',
        plottooltext: 'LPG Consumption: <b>' + this.litres + ' ltrs</b>',
        cylfillhoveralpha: '85',
        theme: 'fusion',
        raphaelgroupfillcolor: '#ffffff',
      },
      value: this.litres,
    };
  }
}

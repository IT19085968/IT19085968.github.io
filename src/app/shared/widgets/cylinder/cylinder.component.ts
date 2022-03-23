import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-widget-cylinder',
  templateUrl: './cylinder.component.html',
  styleUrls: ['./cylinder.component.scss'],
})
export class CylinderComponent implements OnInit, AfterViewInit, OnChanges {
  // @Input() uppeLimit = '';
  // @Input() litres = '';
  // @Input() caption = '';
  @Input() tankInfo = [];
  // Create chart instance
  chart: any;
  litresM: any = '';

  // litresL: any = '';
  // captionL: string = '';
  tankInfoL: any = [];
  rows: any = ['a', 'b', 'c'];

  constructor() {}

  ngOnInit(): void {
    this.tankInfo.forEach((e: any, indexX: number) => {
      let litresL: any = (+e.liters / 1000).toString();
      let captionL: any = e.productName;

      this.chart = am4core.create('"chartdiv" + indexX', am4charts.XYChart3D);
      // this.chart.titles.create().text = 'Crude oil reserves';

      // Add data
      this.chart.data = [
        {
          category: captionL,
          value1: +litresL,
          value2: 100 - +litresL,
          litresM: +litresL * 1000,
        },
      ];

      // Create axes
      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minGridDistance = -5;

      categoryAxis.renderer.labels.template.events.on('over', (ev: any) => {
        var point = categoryAxis.categoryToPoint(ev.target.dataItem.category);
        this.chart.cursor.triggerMove(point, 'soft');
      });

      categoryAxis.renderer.labels.template.events.on('out', (ev: any) => {
        var point = categoryAxis.categoryToPoint(ev.target.dataItem.category);
        this.chart.cursor.triggerMove(point, 'none');
      });

      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = -10;
      valueAxis.max = 110;

      // valueAxis.stroke = am4core.color('#c4cbcc');
      valueAxis.strictMinMax = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.labels.template.adapter.add('text', (text: any) => {
        if (text > 100 || text < 0) {
          return '';
        } else {
          return text + 'kL';
        }
      });
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      // valueAxis.renderer.inside = true;
      // valueAxis.renderer.maxLabelPosition = 0.88;
      // valueAxis.renderer.labels.template.dy = 20;

      function createGrid(value: any) {
        let range = valueAxis.axisRanges.create();
        range.value = value;
        range.label.text = '{value}';
      }

      createGrid(0);
      createGrid(25);
      createGrid(50);
      createGrid(75);
      createGrid(100);

      // Create series
      let series1 = this.chart.series.push(new am4charts.ConeSeries());
      series1.dataFields.valueY = 'value1';
      series1.dataFields.categoryX = 'category';
      series1.columns.template.width = am4core.percent(80);
      series1.columns.template.fillOpacity = 0.9;
      series1.columns.template.strokeOpacity = 1;
      series1.columns.template.strokeWidth = 2;
      // series1.columns.template.fill = am4core.color('#2F96AB');
      // series1.columns.template.stroke = am4core.color('#2F96AB');
      series1.columns.template.fill = am4core.color('#88a2f2');
      series1.columns.template.stroke = am4core.color('#88a2f2');
      // this.litresM = (+this.litres * 100).toString();
      series1.tooltipText = '{litresM}L';

      let series2 = this.chart.series.push(new am4charts.ConeSeries());
      series2.dataFields.valueY = 'value2';
      series2.dataFields.categoryX = 'category';
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(80);
      // series2.columns.template.fill = am4core.color('#2F96AB');
      series2.columns.template.fill = am4core.color('#becdfa');
      series2.columns.template.fillOpacity = 0.1;
      // series2.columns.template.stroke = am4core.color('#2F96AB');
      series2.columns.template.stroke = am4core.color('#becdfa');
      series2.columns.template.strokeOpacity = 0.2;
      series2.columns.template.strokeWidth = 2;

      this.chart.cursor = new am4charts.XYCursor();
      this.chart.cursor.lineY.disabled = true;
      this.chart.cursor.lineX.disabled = true;
    });
  }

  ngAfterViewInit(): void {
    /*this.litresL = (+this.litres / 1000).toString();
    this.captionL = this.caption;
    this.chart = am4core.create('chartdiv', am4charts.XYChart3D);
    // this.chart.titles.create().text = 'Crude oil reserves';

    // Add data
    this.chart.data = [
      {
        category: this.captionL,
        value1: +this.litresL,
        value2: 100 - +this.litresL,
        litresM: +this.litresL * 1000,
      },
    ];

    // Create axes
    let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.tooltip.disabled = true;

    categoryAxis.renderer.labels.template.events.on('over', (ev: any) => {
      var point = categoryAxis.categoryToPoint(ev.target.dataItem.category);
      this.chart.cursor.triggerMove(point, 'soft');
    });

    categoryAxis.renderer.labels.template.events.on('out', (ev: any) => {
      var point = categoryAxis.categoryToPoint(ev.target.dataItem.category);
      this.chart.cursor.triggerMove(point, 'none');
    });

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = -10;
    valueAxis.max = 110;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.adapter.add('text', (text: any) => {
      if (text > 100 || text < 0) {
        return '';
      } else {
        return text + 'kL';
      }
    });

    // Create series
    let series1 = this.chart.series.push(new am4charts.ConeSeries());
    series1.dataFields.valueY = 'value1';
    series1.dataFields.categoryX = 'category';
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.fillOpacity = 0.9;
    series1.columns.template.strokeOpacity = 1;
    series1.columns.template.strokeWidth = 2;
    series1.columns.template.fill = am4core.color('#2F96AB');
    series1.columns.template.stroke = am4core.color('#2F96AB');
    // this.litresM = (+this.litres * 100).toString();
    series1.tooltipText = '{litresM}L';

    let series2 = this.chart.series.push(new am4charts.ConeSeries());
    series2.dataFields.valueY = 'value2';
    series2.dataFields.categoryX = 'category';
    series2.stacked = true;
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.fill = am4core.color('#2F96AB');
    series2.columns.template.fillOpacity = 0.1;
    series2.columns.template.stroke = am4core.color('#2F96AB');
    series2.columns.template.strokeOpacity = 0.2;
    series2.columns.template.strokeWidth = 2;

    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.lineY.disabled = true;
    this.chart.cursor.lineX.disabled = true;*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tankInfo.forEach((e: any, indexX: number) => {
      let litresL: any = (+e.liters / 1000).toString();
      let captionL: any = e.productName;

      this.chart = am4core.create('chartdiv' + indexX, am4charts.XYChart3D);
      // this.chart.titles.create().text = 'Crude oil reserves';

      // Add data
      this.chart.data = [
        {
          category: captionL,
          value1: +litresL,
          value2: 100 - +litresL,
          litresM: +litresL * 1000,
        },
      ];

      // Create axes
      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minGridDistance = -5;

      categoryAxis.renderer.labels.template.events.on('over', (ev: any) => {
        var point = categoryAxis.categoryToPoint(ev.target.dataItem.category);
        this.chart.cursor.triggerMove(point, 'soft');
      });

      categoryAxis.renderer.labels.template.events.on('out', (ev: any) => {
        var point = categoryAxis.categoryToPoint(ev.target.dataItem.category);
        this.chart.cursor.triggerMove(point, 'none');
      });

      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = -10;
      valueAxis.max = 110;

      // valueAxis.stroke = am4core.color('#c4cbcc');
      valueAxis.strictMinMax = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.labels.template.adapter.add('text', (text: any) => {
        if (text > 100 || text < 0) {
          return '';
        } else {
          return text + 'kL';
        }
      });
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      // valueAxis.renderer.inside = true;
      // valueAxis.renderer.maxLabelPosition = 0.88;
      // valueAxis.renderer.labels.template.dy = 20;

      function createGrid(value: any) {
        let range = valueAxis.axisRanges.create();
        range.value = value;
        range.label.text = '{value}';
      }

      createGrid(0);
      createGrid(25);
      createGrid(50);
      createGrid(75);
      createGrid(100);

      // Create series
      let series1 = this.chart.series.push(new am4charts.ConeSeries());
      series1.dataFields.valueY = 'value1';
      series1.dataFields.categoryX = 'category';
      series1.columns.template.width = am4core.percent(80);
      series1.columns.template.fillOpacity = 0.9;
      series1.columns.template.strokeOpacity = 1;
      series1.columns.template.strokeWidth = 2;
      // series1.columns.template.fill = am4core.color('#2F96AB');
      // series1.columns.template.stroke = am4core.color('#2F96AB');
      series1.columns.template.fill = am4core.color('#88a2f2');
      series1.columns.template.stroke = am4core.color('#88a2f2');
      // this.litresM = (+this.litres * 100).toString();
      series1.tooltipText = '{litresM}L';

      let series2 = this.chart.series.push(new am4charts.ConeSeries());
      series2.dataFields.valueY = 'value2';
      series2.dataFields.categoryX = 'category';
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(80);
      // series2.columns.template.fill = am4core.color('#2F96AB');
      series2.columns.template.fill = am4core.color('#becdfa');
      series2.columns.template.fillOpacity = 0.1;
      // series2.columns.template.stroke = am4core.color('#2F96AB');
      series2.columns.template.stroke = am4core.color('#becdfa');
      series2.columns.template.strokeOpacity = 0.2;
      series2.columns.template.strokeWidth = 2;

      this.chart.cursor = new am4charts.XYCursor();
      this.chart.cursor.lineY.disabled = true;
      this.chart.cursor.lineX.disabled = true;
    });
  }
}

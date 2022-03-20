import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pipe, PipeTransform } from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { TankInfo } from 'src/app/shared/models/TankInfo';
import { DispenserInfo } from 'src/app/shared/models/DispenserInfo';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // bigChart: any = [];
  // Cards: any = [];
  pieChartInfo: any = [];
  columnChartInfo: any = [];
  columnTerminals: any = [];
  username: string = 'flexapiuser@felxapi.com';
  password: string = 'f!3x@P1u8eRUt';
  categories: any = [];
  catTerminals: any = [];
  colours: any = [];
  thumbNails: any = [];

  barInfo: any = [];
  lineChartInfo: any = [];
  currentSalesInfo: any = [];
  avgSalesInfo: any = [];
  upperLimitArray: any = [];
  title1: string = 'Hourly Sales by Grade';
  title2: string = 'Average Hourly Sales by Grade';
  title3: string = 'Population of Grades';
  title4: string = 'Current Sales by Grade';
  title5: string = 'Current Sales by Terminal';

  displayedColumns: string[] = [
    'tankID',
    'name',
    'height',
    'liters',
    'waterLevel',
    'temperature',
    'ullage',
  ];

  displayedColumnsDispenser: string[] = [
    'dispenser',
    'dispenserState',
    'nozzleState',
    'amount',
    'volume',
  ];

  dataSource = new MatTableDataSource<TankInfo>();
  dataSourceDispenser = new MatTableDataSource<DispenserInfo>();

  // @ViewChild(MatPaginator, { static: true })
  // paginator!: MatPaginator;
  // @ViewChild(MatPaginator, { static: true })
  // paginatorDPN!: MatPaginator;

  @ViewChild('paginatorDPN')
  paginatorDPN!: MatPaginator;
  @ViewChild('paginatorTNK')
  paginatorTNK!: MatPaginator;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.categories = ['Seattle HQ', 'San Francisco', 'Tokyo'];
    this.catTerminals = ['Seattle HQ', 'San Francisco', 'Tokyo'];

    // this.bigChart = this.dashboardService.bigChart();
    // this.Cards = this.dashboardService.cards();
    this.columnChartInfo = this.dashboardService.column();
    this.columnTerminals = this.dashboardService.column();
    this.barInfo = this.dashboardService.bar();
    this.lineChartInfo = this.dashboardService.line();
    this.currentSalesInfo = this.lineChartInfo;
    this.avgSalesInfo = this.lineChartInfo;
    // this.dataSource.paginator = this.paginatorTNK;
    // this.dataSourceDispenser.paginator = this.paginatorDPN;

    this.getTankInfo();
    this.getDispenserInfo();
    this.getCurrentHourlySales();
    this.getAvgCurrentHourlySales();
    this.getProductSales();
    this.getTerminalSales();
    this.getThumbNails();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTNK;
    this.dataSourceDispenser.paginator = this.paginatorDPN;
  }

  getDispenserInfo(): void {
    this.dashboardService.getDispenserInformation().subscribe((data) => {
      this.dataSourceDispenser.data = data;
      console.log('dispensers: ', data);
    });
  }

  getTankInfo(): void {
    // const pieChartInfo: any[] = [];
    const litresArray: any[] = [];
    // const heightArray: any[] = [];
    const ullageArray: any[] = [];
    const waterLevelArray: any[] = [];

    const barInfo: any[] = [];

    let TotalHeight: number = 0;

    this.dashboardService.getTankInformation().subscribe((data) => {
      this.dataSource.data = data;

      this.dataSource.data.forEach((e: any, index: number) => {
        // pieChartInfo.push({ name: e.productName, y: +e.liters });
        litresArray.push(Math.floor(+e.liters));
        TotalHeight = Math.floor(+e.liters + +e.height);
        this.upperLimitArray.push(TotalHeight.toString());
        // heightArray.push(+TotalHeight);
        ullageArray.push(+e.ullage);
        waterLevelArray.push(+e.waterLevel);
      });

      // this.pieChartInfo = pieChartInfo;

      // columnInfo.push({
      //   name: 'Total Height',
      //   color: 'rgba(165,170,217,1)',
      //   data: heightArray,
      //   pointPadding: 0.3,
      // });
      // columnInfo.push({
      //   name: 'Litres',
      //   color: 'rgba(126,86,134,.9)',
      //   data: litresArray,
      //   pointPadding: 0.4,
      // });

      barInfo.push({
        name: 'Litres',
        data: litresArray,
      });
      barInfo.push({
        name: 'Ullage',
        data: ullageArray,
      });
      barInfo.push({
        name: 'Water Level',
        data: waterLevelArray,
      });

      this.barInfo = barInfo;

      // console.log('column1: ', this.columnChartInfo);
      // console.log('categories1: ', this.categories);
      console.log('bar1: ', this.barInfo);
    });
  }

  getCurrentHourlySales(): void {
    const lineChartInfo: any[] = [];
    let salesArray: any[] = [];
    this.dashboardService.getHourlySalesCurrent().subscribe((data) => {
      data.forEach((e: any) => {
        salesArray = [];
        e.Sales.forEach((e: any) => {
          salesArray.push(+e.TotalSales);
        });
        lineChartInfo.push({ name: e.ItemName, data: salesArray });
      });

      this.currentSalesInfo = lineChartInfo;
      console.log('sales: ', data);
    });

    console.log('line1', this.lineChartInfo);
    console.log('line2', lineChartInfo);
  }

  getAvgCurrentHourlySales(): void {
    const lineChartInfo: any[] = [];
    let salesArray: any[] = [];
    this.dashboardService.getAvgHourlySalesCurrent().subscribe((data) => {
      data.forEach((e: any) => {
        salesArray = [];
        e.Sales.forEach((e: any) => {
          salesArray.push(+e.TotalSales);
        });
        lineChartInfo.push({ name: e.ItemName, data: salesArray });
      });

      this.avgSalesInfo = lineChartInfo;
      console.log('salesAvg: ', data);
    });

    console.log('line3', lineChartInfo);
  }

  getProductSales(): void {
    const pieChartInfo: any[] = [];
    const columnInfo: any[] = [];
    const fullColumnInfo: any[] = [];
    const categories: any[] = [];
    // const colours: any[] = [];
    this.dashboardService.getProductSales().subscribe((data) => {
      data.forEach((e: any) => {
        pieChartInfo.push({ name: e.productName, y: +e.totalAmount });
        categories.push(e.productName);
        columnInfo.push(+e.totalAmount);
        // colours.push('#' + e.backColour);
      });

      fullColumnInfo.push({
        name: 'Grades',
        data: columnInfo,
      });

      this.columnChartInfo = fullColumnInfo;
      this.categories = categories;
      // this.colours = colours;

      this.pieChartInfo = pieChartInfo;
      console.log('product sales: ', data);
    });
  }

  getTerminalSales(): void {
    const columnInfo: any[] = [];
    const fullColumnInfo: any[] = [];
    const categories: any[] = [];

    this.dashboardService.getTerminalSales().subscribe((data) => {
      data.forEach((e: any) => {
        categories.push(e.terminalId);
        columnInfo.push(+e.terminalName);
      });

      fullColumnInfo.push({
        name: 'Terminals',
        data: columnInfo,
      });

      this.columnTerminals = fullColumnInfo;
      this.catTerminals = categories;
      console.log('terminals: ', data);
    });
  }

  getThumbNails(): void {
    const colours: any[] = [];
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
      data.forEach((e: any) => {
        colours.push(e.backColour);
      });

      this.colours = colours;

      console.log('thumbnails: ', this.thumbNails);
    });
  }
}

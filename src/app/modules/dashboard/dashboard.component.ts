import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pipe, PipeTransform } from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { TankInfo } from 'src/app/shared/models/TankInfo';
import { DispenserInfo } from 'src/app/shared/models/DispenserInfo';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  pieChartInfo: any = [];
  columnChartInfo: any = [];
  columnTerminals: any = [];
  username: string = 'flexapiuser@felxapi.com';
  password: string = 'f!3x@P1u8eRUt';
  categories: any = [];
  catTerminals: any = [];
  colours: any = [];
  pieColours: any = [];
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

  @ViewChild('paginatorDPN')
  paginatorDPN!: MatPaginator;
  @ViewChild('paginatorTNK')
  paginatorTNK!: MatPaginator;
  subscriptions: Subscription[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.categories = ['Seattle HQ', 'San Francisco', 'Tokyo'];
    this.catTerminals = ['Seattle HQ', 'San Francisco', 'Tokyo'];

    this.columnChartInfo = this.dashboardService.column();
    this.columnTerminals = this.dashboardService.column();
    this.barInfo = this.dashboardService.bar();
    this.lineChartInfo = this.dashboardService.line();
    this.currentSalesInfo = this.lineChartInfo;
    this.avgSalesInfo = this.lineChartInfo;

    this.getCurrentHourlySales();
    this.getAvgCurrentHourlySales();
    this.getProductSales();
    this.getProportions();
    this.getTerminalSales();
    this.getThumbNails();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTNK;
    this.dataSourceDispenser.paginator = this.paginatorDPN;
  }

  getCurrentHourlySales(): void {
    const lineChartInfo: any[] = [];
    let salesArray: any[] = [];
    const sub1: any = this.dashboardService
      .getHourlySalesCurrent()
      .subscribe((data) => {
        data.forEach((e: any) => {
          salesArray = [];
          e.Sales.forEach((e: any) => {
            salesArray.push(+e.TotalSales);
          });
          lineChartInfo.push({ name: e.ItemName, data: salesArray });
        });

        this.currentSalesInfo = lineChartInfo;
      });

    this.subscriptions.push(sub1);
  }

  getAvgCurrentHourlySales(): void {
    const lineChartInfo: any[] = [];
    let salesArray: any[] = [];
    const sub2: any = this.dashboardService
      .getAvgHourlySalesCurrent()
      .subscribe((data) => {
        data.forEach((e: any) => {
          salesArray = [];
          e.Sales.forEach((e: any) => {
            salesArray.push(+e.TotalSales);
          });
          lineChartInfo.push({ name: e.ItemName, data: salesArray });
        });

        this.avgSalesInfo = lineChartInfo;
      });
    this.subscriptions.push(sub2);
  }

  getProductSales(): void {
    // const pieChartInfo: any[] = [];
    const columnInfo: any[] = [];
    const fullColumnInfo: any[] = [];
    const categories: any[] = [];
    // const colours: any[] = [];
    const sub3: any = this.dashboardService
      .getProductSales()
      .subscribe((data) => {
        data.forEach((e: any) => {
          // pieChartInfo.push({ name: e.productName, y: +e.totalAmount });
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

        // this.pieChartInfo = pieChartInfo;
      });
    this.subscriptions.push(sub3);
  }

  getProportions(): void {
    const pieChartInfo: any[] = [];
    const colors: any = [];
    const sub3: any = this.dashboardService
      .getGradeProportion()
      .subscribe((data) => {
        data.forEach((e: any) => {
          colors.push(e.backColour);
          pieChartInfo.push({ name: e.gradeName, y: +e.propotion });
        });

        this.pieChartInfo = pieChartInfo;
        this.pieColours = colors;
      });
    this.subscriptions.push(sub3);
  }

  getTerminalSales(): void {
    const columnInfo: any[] = [];
    const fullColumnInfo: any[] = [];
    const categories: any[] = [];

    const sub4: any = this.dashboardService
      .getTerminalSales()
      .subscribe((data) => {
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
      });
    this.subscriptions.push(sub4);
  }

  getThumbNails(): void {
    const colours: any[] = [];
    const sub5: any = this.dashboardService
      .getThumbNails()
      .subscribe((data) => {
        this.thumbNails = data;
        data.forEach((e: any) => {
          colours.push(e.backColour);
        });

        this.colours = colours;
        Swal.close();
      });

    this.subscriptions.push(sub5);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}

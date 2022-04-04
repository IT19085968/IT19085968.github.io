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

  lineChartInfo: any = [];
  currentSalesInfo: any = [];
  avgSalesInfo: any = [];
  upperLimitArray: any = [];
  title1: string = 'Hourly Sales by Grade';
  title2: string = 'Average Hourly Sales by Grade';
  title3: string = 'Population of Grades';
  title4: string = 'Current Sales by Grade';
  title5: string = 'Current Sales by Terminal';

  displayedColumnsPump: string[] = [
    'pumpID',
    'lastTransTime',
    'idleHours',
  ];

  displayedColumnsTerminal: string[] = [
    'terminalID',
    'lastTransTime',
    'idleHours',
  ];

  dataSourcePump = new MatTableDataSource<any>();
  dataSourceTerminal = new MatTableDataSource<any>();

  @ViewChild('paginatorTerminal')
  paginatorTerminal!: MatPaginator;
  @ViewChild('paginatorPump')
  paginatorPump!: MatPaginator;
  subscriptions: Subscription[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.categories = ['Unleaded 91', 'Unleaded 95', 'Diesel'];
    this.catTerminals = ['5'];

    this.columnChartInfo = this.dashboardService.column2();
    this.columnTerminals = this.dashboardService.column();
    this.lineChartInfo = this.dashboardService.line();
    this.currentSalesInfo = this.lineChartInfo;
    this.avgSalesInfo = this.lineChartInfo;

    this.getCurrentHourlySales();
    this.getAvgCurrentHourlySales();
    this.getProductSales();
    this.getProportions();
    this.getTerminalSales();
    this.getIdlePumps();
    this.getIdleTerminals();
    this.getThumbNails();
  }

  ngAfterViewInit(): void {
    this.dataSourcePump.paginator = this.paginatorPump;
    this.dataSourceTerminal.paginator = this.paginatorTerminal;
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

  getIdlePumps(): void {
    const sub6: any = this.dashboardService
      .getPumpIdleStatus()
      .subscribe((data) => {
        this.dataSourcePump.data = data;
        console.log('pumps:', data);
      });

    this.subscriptions.push(sub6);
  }

  getIdleTerminals(): void {
    const sub7: any = this.dashboardService
      .getTerminalIdleStatus()
      .subscribe((data) => {
        this.dataSourceTerminal.data = data;
        console.log('terminals:', data);
      });

    this.subscriptions.push(sub7);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}

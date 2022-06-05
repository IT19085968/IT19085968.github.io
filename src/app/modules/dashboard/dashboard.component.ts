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
import { of, Subject, Subscription, timer } from 'rxjs';
import {
  catchError,
  filter,
  multicast,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
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
  timerSub1: any = [];
  timerSub2: any = [];
  timerSub3: any = [];
  timerSub4: any = [];
  timerSub5: any = [];
  timerSub6: any = [];
  timerSub7: any = [];

  testSubject1 = new Subject();
  testSubject2 = new Subject();
  testSubject3 = new Subject();
  testSubject4 = new Subject();
  testSubject5 = new Subject();
  testSubject6 = new Subject();
  testSubject7 = new Subject();

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
    let lineChartInfo: any[] = [];
    let salesArray: any[] = [];

    let timerTest: any = timer(0, 90000).pipe(
      takeUntil(this.testSubject1),
      switchMap((x) => {
        return this.dashboardService.getHourlySalesCurrent().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub1.push(
      timerTest.subscribe((data: any[]) => {
        lineChartInfo = [];
        salesArray = [];
        data.forEach((e: any) => {
          salesArray = [];
          e.Sales.forEach((e: any) => {
            salesArray.push(+e.TotalSales);
          });
          lineChartInfo.push({ name: e.ItemName, data: salesArray });
        });

        this.currentSalesInfo = lineChartInfo;
      })
    );

    timerTest.connect();
  }

  getAvgCurrentHourlySales(): void {
    let lineChartInfo: any[] = [];
    let salesArray: any[] = [];

    let timerTest: any = timer(0, 90000).pipe(
      takeUntil(this.testSubject2),
      switchMap((x) => {
        return this.dashboardService.getAvgHourlySalesCurrent().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub2.push(
      timerTest.subscribe((data: any[]) => {
        lineChartInfo = [];
        salesArray = [];
        data.forEach((e: any) => {
          salesArray = [];
          e.Sales.forEach((e: any) => {
            salesArray.push(+e.TotalSales);
          });
          lineChartInfo.push({ name: e.ItemName, data: salesArray });
        });

        this.avgSalesInfo = lineChartInfo;
      })
    );

    timerTest.connect();
  }

  getProductSales(): void {
    let columnInfo: any[] = [];
    let fullColumnInfo: any[] = [];
    let categories: any[] = [];

    let timerTest: any = timer(0, 90000).pipe(
      takeUntil(this.testSubject3),
      switchMap((x) => {
        return this.dashboardService.getProductSales().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub3.push(
      timerTest.subscribe((data: any[]) => {
        columnInfo = [];
        fullColumnInfo = [];
        categories = [];
        
        data.forEach((e: any) => {
          categories.push(e.productName);
          columnInfo.push(+e.totalAmount);
        });

        fullColumnInfo.push({
          name: 'Grades',
          data: columnInfo,
        });

        this.columnChartInfo = fullColumnInfo;
        this.categories = categories;
      })
    );

    timerTest.connect();
  }

  getProportions(): void {
    let pieChartInfo: any[] = [];
    let colors: any = [];

    let timerTest: any = timer(0, 90000).pipe(
      takeUntil(this.testSubject4),
      switchMap((x) => {
        return this.dashboardService.getGradeProportion().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub4.push(
      timerTest.subscribe((data: any[]) => {
        pieChartInfo = [];
        colors = [];
        data.forEach((e: any) => {
          colors.push(e.backColour);
          pieChartInfo.push({ name: e.gradeName, y: +e.propotion });
        });

        this.pieChartInfo = pieChartInfo;
        this.pieColours = colors;
      })
    );

    timerTest.connect();
  }

  getTerminalSales(): void {
    let columnInfo: any[] = [];
    let fullColumnInfo: any[] = [];
    let categories: any[] = [];

    let timerTest: any = timer(0, 90000).pipe(
      takeUntil(this.testSubject5),
      switchMap((x) => {
        return this.dashboardService.getTerminalSales().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub5.push(
      timerTest.subscribe((data: any[]) => {
        columnInfo = [];
        fullColumnInfo = [];
        categories = [];
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
      })
    );

    timerTest.connect();
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
    let timerTest: any = timer(0, 90000).pipe(
      takeUntil(this.testSubject7),
      switchMap((x) => {
        return this.dashboardService.getTerminalSales().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub7.push(
      timerTest.subscribe((data: any[]) => {
        
        this.dataSourcePump.data = data;
        console.log('pumps:', data);
      })
    );

    timerTest.connect();
  }

  getIdleTerminals(): void {
    let timerTest: any = timer(0, 90000).pipe(
      takeUntil(this.testSubject6),
      switchMap((x) => {
        return this.dashboardService.getTerminalIdleStatus().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub6.push(
      timerTest.subscribe((data: any[]) => {
        this.dataSourceTerminal.data = data;
        console.log('terminals:', data);
      })
    );

    timerTest.connect();
  }

  ngOnDestroy(): void {
    this.testSubject1.next();
    this.timerSub1.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.testSubject2.next();
    this.timerSub2.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.testSubject3.next();
    this.timerSub3.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.testSubject4.next();
    this.timerSub4.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.testSubject5.next();
    this.timerSub5.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.testSubject6.next();
    this.timerSub6.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.testSubject7.next();
    this.timerSub7.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}

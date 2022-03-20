import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { TankInfo } from 'src/app/shared/models/TankInfo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { of, Subscription, timer } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tank-info',
  templateUrl: './tank-info.component.html',
  styleUrls: ['./tank-info.component.scss'],
})
export class TankInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  tankInfo: any = [];
  noOfRows: any = [];
  upperLimitArray: any = [];
  rows: number = 0;
  defaultNumberG: any = [];
  count: number = 0;

  thumbNails: any = [];
  subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'tankID',
    'name',
    'height',
    'liters',
    'waterLevel',
    'temperature',
    'ullage',
  ];

  dataSource = new MatTableDataSource<TankInfo>();

  @ViewChild('paginatorTNK')
  paginatorTNK!: MatPaginator;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getTankInfo();
    this.defaultNumberG = ['1', '2'];
    this.getThumbNails();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTNK;
  }

  getTankInfo(): void {
    const litresArray: any[] = [];
    let TotalHeight: number = 0;

    const sub1: any = timer(0, 60000)
      .pipe(
        switchMap(() => {
          return this.dashboardService.getTankInformation().pipe(
            catchError((err) => {
              // Handle errors
              console.error(err);
              return of([]);
            })
          );
        }),
        filter((data) => data !== undefined)
      )
      .subscribe((data) => {
        this.tankInfo = data;
        this.dataSource.data = data;
        this.upperLimitArray = [];
        this.noOfRows = [];

        this.tankInfo.forEach((e: any, index: number) => {
          TotalHeight = Math.floor(+e.liters + +e.height);
          this.upperLimitArray.push(TotalHeight.toString());
        });

        if (this.tankInfo.length > 0) {
          const totalElements: any = this.tankInfo.length / 2;
          this.rows = Math.ceil(totalElements);
          for (let i = 0; i < this.rows; i++) {
            this.noOfRows.push('a');
          }
          console.log('tankInfo: ', this.tankInfo);
          console.log('justDivi: ', totalElements);
          console.log('roundOff: ', this.noOfRows);
        }
      });

    this.subscriptions.push(sub1);
  }

  valueChange(e: any): void {
    this.count = this.count + 1;
    console.log('count: ', this.count);
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
      console.log('thumbnails: ', this.thumbNails);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}

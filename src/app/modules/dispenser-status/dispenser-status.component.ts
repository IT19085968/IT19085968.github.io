import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DashboardService } from '../dashboard.service';
import { TransactionService } from '../transaction.service';
import { deliveryTotals } from '../../shared/models/deliveryTotals';
import { electronicTotals } from '../../shared/models/electronicTotals';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of, Subject, Subscription, timer } from 'rxjs';
import * as moment from 'moment';
import {
  catchError,
  filter,
  multicast,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-dispenser-status',
  templateUrl: './dispenser-status.component.html',
  styleUrls: ['./dispenser-status.component.scss'],
})
export class DispenserStatusComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  searchDeliveryFormGroup!: FormGroup;
  searchElectFormGroup!: FormGroup;
  dataSourceDispenser = new MatTableDataSource<any>();
  dataSourceDeliveryTotals = new MatTableDataSource<deliveryTotals>();
  dataSourceElectronicTotals = new MatTableDataSource<electronicTotals>();

  displayedColumnsDispenser: string[] = [
    'dispenser',
    'dispenserState',
    'nozzleState',
    'amount',
    'volume',
  ];

  displayedColumnsDelivery: string[] = [
    'deliveryID',
    'productID',
    'productName',
    'volume',
    'price',
    'amount',
    'transDate',
    'transTime',
  ];

  displayedColumnsElectronics: string[] = [
    'terminal',
    'pump',
    'productID',
    'productName',
    'price',
    'amount',
    'volume',
    'deliveries',
  ];

  @ViewChild('paginatorDPN')
  paginatorDPN!: MatPaginator;

  @ViewChild('paginatorDEL')
  paginatorDEL!: MatPaginator;

  @ViewChild('paginatorELEC')
  paginatorELEC!: MatPaginator;

  subscriptions: Subscription[] = [];
  timerSub: any = [];

  testSubject = new Subject();

  constructor(
    private dashboardService: DashboardService,
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDispenserInfo();
    this.createDeliveryForm();
    this.createElectronicForm();
  }

  ngAfterViewInit(): void {
    this.dataSourceDispenser.paginator = this.paginatorDPN;
    this.dataSourceDeliveryTotals.paginator = this.paginatorDEL;
    this.dataSourceElectronicTotals.paginator = this.paginatorELEC;
  }

  getDispenserInfo(): void {
    let timerTest: any = timer(0, 1000).pipe(
      takeUntil(this.testSubject),
      switchMap((x) => {
        return this.dashboardService.getDispenserInformation().pipe(
          catchError((err) => {
            // Handle errors
            console.error(err);
            return of([]);
          })
        );
      }),
      multicast(() => new Subject())
    );
    this.timerSub.push(
      timerTest.subscribe((data: any[]) => {
        this.dataSourceDispenser.data = data;
        this.changeDetectorRefs.detectChanges();
      })
    );

    timerTest.connect();

    // this.subscriptions.push(this.timerSub);
  }

  createDeliveryForm(): void {
    this.searchDeliveryFormGroup = this.formBuilder.group({
      FromDate: [''],
      ToDate: [''],
    });
  }

  createElectronicForm(): void {
    this.searchElectFormGroup = this.formBuilder.group({
      AsAtDate: [''],
    });
  }

  getDeliveryTotals(): void {
    const filter: any = {};

    filter.FromDate = this.searchDeliveryFormGroup?.value.FromDate
      ? moment(this.searchDeliveryFormGroup?.value.FromDate).format(
          'YYYY-MM-DD'
        )
      : null;
    filter.ToDate = this.searchDeliveryFormGroup?.value.ToDate
      ? moment(this.searchDeliveryFormGroup?.value.ToDate).format('YYYY-MM-DD')
      : null;

    const subscription: any = this.transactionService
      .getDeliveryTotals(filter.FromDate, filter.ToDate)
      .subscribe((data) => {
        this.dataSourceDeliveryTotals.data = data;
      });

    this.subscriptions.push(subscription);
  }

  getElectronicTotals(): void {
    const filter: any = {};

    filter.AsAtDate = this.searchElectFormGroup?.value.AsAtDate
      ? moment(this.searchElectFormGroup?.value.AsAtDate).format('YYYY-MM-DD')
      : null;

    const subscription: any = this.transactionService
      .getElectronicTotals(filter.AsAtDate)
      .subscribe((data) => {
        this.dataSourceElectronicTotals.data = data;
      });

    this.subscriptions.push(subscription);
  }

  clearFieldsDel(): void {
    this.searchDeliveryFormGroup.reset();
    this.dataSourceDeliveryTotals.data = [];
  }

  clearFieldsElec(): void {
    this.searchElectFormGroup.reset();
    this.dataSourceElectronicTotals.data = [];
  }

  ngOnDestroy(): void {
    this.testSubject.next();
    this.timerSub.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subscriptions.forEach((sub: Subscription) => {
      sub ? sub.unsubscribe() : null;
    });
  }
}

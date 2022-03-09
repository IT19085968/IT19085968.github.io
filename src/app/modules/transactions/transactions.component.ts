import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, interval } from 'rxjs';
import { TRSearchModel } from 'src/app/shared/models/TRSearchModel';
import * as moment from 'moment';
import { DashboardService } from '../dashboard.service';
import { TransactionService } from '../transaction.service';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Transaction } from 'src/app/shared/models/Transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy, AfterViewInit {
  searchFormGroup!: FormGroup;
  searchInput: FormControl = new FormControl();
  TRreceipt: FormControl = new FormControl();

  displayedColumns: string[] = [
    'transactionID',
    'terminalID',
    'cardNumber',
    'amount',
    'transactionDate',
    'fuelGrade',
    'receipt',
  ];

  dataSource = new MatTableDataSource<Transaction>();

  @ViewChild('paginatorTR')
  paginatorTR!: MatPaginator;

  Receipt: string = '';
  fuelGrades: any = [];
  pumps: any = [];
  terminals: any = [];
  thumbNails: any = [];
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginatorTR;
    this.createForm();

    const sub1: any = this.transactionService
      .getFuelGradeInformation()
      .subscribe((data) => {
        this.fuelGrades = data;
        console.log('fuel: ', this.fuelGrades);
      });

    this.subscriptions.push(sub1);

    const sub2: any = this.transactionService
      .getPumpsInformation()
      .subscribe((data) => {
        this.pumps = data;
        console.log('pumps: ', this.pumps);
      });

    this.subscriptions.push(sub2);

    const sub3: any = this.transactionService
      .getTerminalsInformation()
      .subscribe((data) => {
        this.terminals = data;
        console.log('terminals: ', this.terminals);
      });

    this.subscriptions.push(sub3);

    this.getThumbNails();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTR;
  }

  createForm(): void {
    this.searchFormGroup = this.formBuilder.group({
      FromDate: [''],
      ToDate: [''],
      SearchText: this.searchInput,
      PumpID: [''],
      TerminalID: [''],
      BlendID: [''],
    });
  }

  applyFilter(): void {
    const filter: any = {};

    filter.SearchText = this.searchInput.value ? this.searchInput.value : '';
    filter.FromDate = this.searchFormGroup?.value.FromDate
      ? moment(this.searchFormGroup?.value.FromDate).format('YYYY-MM-DD')
      : null;
    filter.ToDate = this.searchFormGroup?.value.ToDate
      ? moment(this.searchFormGroup?.value.ToDate).format('YYYY-MM-DD')
      : null;
    filter.PumpID = this.searchFormGroup?.value.PumpID
      ? this.searchFormGroup?.value.PumpID
      : '0';
    filter.TerminalID = this.searchFormGroup?.value.TerminalID
      ? this.searchFormGroup?.value.TerminalID
      : '0';
    filter.BlendID = this.searchFormGroup?.value.BlendID
      ? this.searchFormGroup?.value.BlendID
      : '0';

    const subscription: any = this.transactionService
      .postTRSearchQuery(filter)
      .subscribe((data) => {
        console.log('Transactions: ', data);
        this.dataSource.data = data;
      });

    this.subscriptions.push(subscription);

    this.TRreceipt.setValue(null);
  }

  openReceipt(receipt: any): void {
    console.log('receipt:', receipt);
    this.TRreceipt.setValue(receipt);
  }

  clearFields(): void {
    this.searchFormGroup.reset();
    this.TRreceipt.setValue(null);
    this.dataSource.data = [];
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

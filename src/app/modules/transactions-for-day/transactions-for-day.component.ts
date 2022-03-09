import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject, interval } from 'rxjs';
import { TRSearchModel } from 'src/app/shared/models/TRSearchModel';
import { TransactionService } from '../transaction.service';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Transaction } from 'src/app/shared/models/Transaction';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-transactions-for-day',
  templateUrl: './transactions-for-day.component.html',
  styleUrls: ['./transactions-for-day.component.scss'],
})
export class TransactionsForDayComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'transactionID',
    'terminalID',
    'cardNumber',
    'amount',
    'transactionDate',
    'fuelGrade',
  ];

  thumbNails: any = [];

  dataSource = new MatTableDataSource<Transaction>();

  @ViewChild('paginatorTR')
  paginatorTR!: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.getThumbNails();
    this.dataSource.paginator = this.paginatorTR;
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
      console.log('thumbnails: ', this.thumbNails);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTR;
  }
}

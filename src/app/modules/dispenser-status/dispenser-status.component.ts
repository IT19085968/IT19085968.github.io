import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DashboardService } from '../dashboard.service';
import { DispenserInfo } from 'src/app/shared/models/DispenserInfo';

@Component({
  selector: 'app-dispenser-status',
  templateUrl: './dispenser-status.component.html',
  styleUrls: ['./dispenser-status.component.scss'],
})
export class DispenserStatusComponent implements OnInit, AfterViewInit {
  dataSourceDispenser = new MatTableDataSource<DispenserInfo>();

  displayedColumnsDispenser: string[] = [
    'dispenser',
    'dispenserState',
    'nozzleState',
    'amount',
    'volume',
  ];

  thumbNails: any = [];

  @ViewChild('paginatorDPN')
  paginatorDPN!: MatPaginator;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getDispenserInfo();
    this.getThumbNails();
  }

  ngAfterViewInit(): void {
    this.dataSourceDispenser.paginator = this.paginatorDPN;
  }

  getDispenserInfo(): void {
    this.dashboardService.getDispenserInformation().subscribe((data) => {
      this.dataSourceDispenser.data = data;
    });
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
      console.log('thumbnails: ', this.thumbNails);
    });
  }
}

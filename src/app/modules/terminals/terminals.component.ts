import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatTableDataSource } from '@angular/material/table';

import { DashboardService } from '../dashboard.service';
import { TerminalsService } from '../terminals.service';
// MDB Angular Pro
// import {
//   WavesModule,
//   PreloadersModule,
//   ProgressbarModule,
//   MdProgressBarModule,
// } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-terminals',
  templateUrl: './terminals.component.html',
  styleUrls: ['./terminals.component.scss'],
})
export class TerminalsComponent implements OnInit, AfterViewInit {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  thumbNails: any = [];
  terminals: any = [];

  dataSource = new MatTableDataSource<any>();

  @ViewChild('paginatorTNK')
  paginatorTNK!: MatPaginator;

  displayedColumns: string[] = ['serial', 'ipAddress', 'paperLevel'];

  constructor(
    private dashboardService: DashboardService,
    private terminalsService: TerminalsService
  ) {}

  ngOnInit(): void {
    this.getThumbNails();
    this.getAllTerminals();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTNK;
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
      console.log('thumbnails: ', this.thumbNails);
    });
  }

  getAllTerminals(): void {
    this.terminalsService.getAllTerminals().subscribe((data) => {
      this.terminals = data;
      this.dataSource.data = data;
      console.log('terminals: ', this.terminals);
    });
  }
}

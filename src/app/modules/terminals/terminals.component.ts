import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
})
export class TerminalsComponent implements OnInit, AfterViewInit {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  thumbNails: any = [];
  terminals: any = [];

  dataSource = new MatTableDataSource<any>();

  @ViewChild('paginatorTNK')
  paginatorTNK!: MatPaginator;

  color2: any = null;

  displayedColumns: string[] = [
    'serial',
    'ipAddress',
    'paperLevel',
    'printerStatus',
    'terminalStatus',
  ];

  constructor(
    private dashboardService: DashboardService,
    private terminalsService: TerminalsService
  ) {}

  ngOnInit(): void {
    this.getThumbNails();
    this.getAllTerminals();
    this.color2 = '#15E27D';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTNK;
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
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

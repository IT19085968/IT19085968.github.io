import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

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
export class TerminalsComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  thumbNails: any = [];
  terminals: any = [];
  constructor(
    private dashboardService: DashboardService,
    private terminalsService: TerminalsService
  ) {}

  ngOnInit(): void {
    this.getThumbNails();
    this.getAllTerminals();
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
      console.log('terminals: ', this.terminals);
    });
  }
}

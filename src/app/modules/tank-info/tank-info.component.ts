import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { TankInfo } from 'src/app/shared/models/TankInfo';

@Component({
  selector: 'app-tank-info',
  templateUrl: './tank-info.component.html',
  styleUrls: ['./tank-info.component.scss'],
})
export class TankInfoComponent implements OnInit {
  tankInfo: any = [];
  noOfRows: any = [];
  upperLimitArray: any = [];
  rows: number = 0;
  defaultNumberG: any = [];
  count: number = 0;

  thumbNails: any = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getTankInfo();
    this.defaultNumberG = ['1', '2'];
    this.getThumbNails();
  }

  getTankInfo(): void {
    const litresArray: any[] = [];
    let TotalHeight: number = 0;

    this.dashboardService.getTankInformation().subscribe((data) => {
      this.tankInfo = data;

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
}

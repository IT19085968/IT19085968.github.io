import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  thumbNails: any = [];
  subscriptions: Subscription[] = [];

  retUrl: any = '';
  reportType: any = '';
  varRoutes:any = 1;

  // @Output() timeEvent = new EventEmitter();
  constructor(private dashboardService: DashboardService,
    private router: Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getThumbNails();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.retUrl = params.get('retUrl');
      console.log('LoginComponent/ngOnInit ' + this.retUrl);
    });
    // this.timeEvent.emit(this.reportType);
  }

  getThumbNails(): void {
    this.dashboardService.getThumbNails().subscribe((data) => {
      this.thumbNails = data;
    });
  }

  openReportPage(t:any): void {
    this.retUrl = '/default/reportsGen/';
    // this.timeEvent.emit(this.reportType);
    this.router.navigate([this.retUrl],t);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub ? sub.unsubscribe() : null;
    });
  }

}

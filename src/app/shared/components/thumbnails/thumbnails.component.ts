import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject, Subscription, timer } from 'rxjs';
import { catchError, multicast, switchMap, takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../../modules/dashboard.service';

@Component({
  selector: 'app-thumbnails',
  templateUrl: './thumbnails.component.html',
  styleUrls: ['./thumbnails.component.scss']
})
export class ThumbnailsComponent implements OnInit,OnDestroy {

  subscriptions: Subscription[] = [];

  thumbNails: any = [];
  timerSub: any = [];

  testSubject = new Subject();
  
  constructor(private dashboardService: DashboardService,) { }

  ngOnInit(): void {
    this.getThumbNails();
  }

  getThumbNails(): void {
    let timerTest: any = timer(0, 60000).pipe(
      takeUntil(this.testSubject),
      switchMap((x) => {
        return this.dashboardService.getThumbNails().pipe(
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
        this.thumbNails = [];
        this.thumbNails = data;
      })
    );

    timerTest.connect();
  }

  ngOnDestroy(): void {
    this.testSubject.next();
    this.timerSub.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TRSearchModel } from '../shared/models/TRSearchModel';
import * as moment from 'moment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  readonly APIUrl = 'http://202.92.217.56:8281/flexapi/Dispenser';

  currentDate: any = moment(new Date('2022-02-10')).format('YYYY-MM-DD')
    ? moment(new Date('2022-02-10')).format('YYYY-MM-DD')
    : moment(new Date()).format('YYYY-MM-DD');
  anyText: string = this.authService.userData?.id
    ? this.authService.userData?.id
    : 'AA';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('flexapiuser@felxapi.com:f!3x@P1u8eRUt'),
    }),
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTankInformation(): Observable<any[]> {
    // return this.http.get<any>(this.APIUrl, this.httpOptions);
    return this.http.get<any>(`${environment.apiURL}/Tanks`, this.httpOptions);
  }

  getDispenserInformation(): Observable<any[]> {
    // return this.http.get<any>(this.APIUrl, this.httpOptions);
    return this.http.get<any>(
      `${environment.apiURL}/Dispenser`,
      this.httpOptions
    );
  }

  getHourlySalesCurrent(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Dashboard/HourlySalesCurrent/${this.currentDate}?uniqueID="AA"`,
      this.httpOptions
    );
  }

  getAvgHourlySalesCurrent(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Dashboard/HourlySalesAvg/${this.currentDate}?uniqueID=${this.anyText}`,
      this.httpOptions
    );
  }

  getProductSales(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Dashboard/ProductSales/${this.currentDate}`,
      this.httpOptions
    );
  }

  getTerminalSales(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Dashboard/TerminalSales/${this.currentDate}`,
      this.httpOptions
    );
  }

  getThumbNails(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Dashboard/Thumbs/${this.currentDate}`,
      this.httpOptions
    );
  }

  // bigChart() {
  //   return [
  //     {
  //       name: 'Asia',
  //       data: [502, 635, 809, 947, 1402, 3634, 5268],
  //     },
  //     {
  //       name: 'Africa',
  //       data: [106, 107, 111, 133, 221, 767, 1766],
  //     },
  //     {
  //       name: 'Europe',
  //       data: [163, 203, 276, 408, 547, 729, 628],
  //     },
  //     {
  //       name: 'America',
  //       data: [18, 31, 54, 156, 339, 818, 1201],
  //     },
  //     {
  //       name: 'Oceania',
  //       data: [2, 2, 2, 6, 13, 30, 46],
  //     },
  //   ];
  // }

  // cards() {
  //   return [71, 78, 39, 66];
  // }

  // column() {
  //   return [
  //     {
  //       name: 'Employees',
  //       color: 'rgba(165,170,217,1)',
  //       data: [49, 19, 35],
  //       pointPadding: 0.3,
  //       // pointPlacement: -0.2,
  //     },
  //     {
  //       name: 'Employees Optimized',
  //       color: 'rgba(126,86,134,.9)',
  //       data: [47, 17, 33],
  //       pointPadding: 0.4,
  //       // pointPlacement: -0.2,
  //     },
  //   ];
  // }

  bar() {
    return [
      {
        name: 'John',
        data: [5, 3, 4],
      },
      {
        name: 'Jane',
        data: [2, 2, 3],
      },
      {
        name: 'Joe',
        data: [3, 4, 4],
      },
    ];
  }

  line() {
    return [
      {
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
      },
      {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
      },
      {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
      },
    ];
  }

  column() {
    return [
      {
        name: 'Tokyo',
        y: 49.9,
      },
    ];
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
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

  getGradeProportion(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Dashboard/GradePropotion/${this.currentDate}`,
      this.httpOptions
    );
  }

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
        name: 'Terminals',
        data:[30.58]
      },
    ];
  }

  column2() {
    return [
      {
        name: 'Grades',
        data:[15.58,0.00,15.00]
      },
    ];
  }
}

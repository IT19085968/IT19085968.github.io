import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('flexapiuser@felxapi.com:f!3x@P1u8eRUt'),
    }),
  };

  constructor(private http: HttpClient) {}

  getSalesTotalReport(FromDate: any, ToDate: any): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Reports/GetSales?FromDate=${FromDate}&ToDate=${ToDate}`,
      this.httpOptions
    );
  }

  getPMWiseReport(FromDate: any, ToDate: any): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Reports/PMWiseSales?FromDate=${FromDate}&ToDate=${ToDate}`,
      this.httpOptions
    );
  }

  getPumps(FromDate: any, ToDate: any): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Reports/PumpWiseSales?FromDate=${FromDate}&ToDate=${ToDate}`,
      this.httpOptions
    );
  }

  getTerminals(FromDate: any, ToDate: any): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Reports/TerminalWiseSales?FromDate=${FromDate}&ToDate=${ToDate}`,
      this.httpOptions
    );
  }

  getSalesComparison(FromDate: any, ToDate: any): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Reports/SalesComparison?FromDate=${FromDate}&ToDate=${ToDate}`,
      this.httpOptions
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { TRSearchModel } from '../shared/models/TRSearchModel';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('flexapiuser@felxapi.com:f!3x@P1u8eRUt'),
    }),
  };

  constructor(private http: HttpClient) {}

  postTRSearchQuery(searchQuery: any): Observable<any[]> {
    return this.http.post<any>(
      `${environment.apiURL}/Transactions`,
      searchQuery,
      this.httpOptions
    );
  }

  getPumpsInformation(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Transactions/Pumps`,
      this.httpOptions
    );
  }

  getTerminalsInformation(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Transactions/Terminals`,
      this.httpOptions
    );
  }

  getFuelGradeInformation(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Transactions/Products`,
      this.httpOptions
    );
  }

  getDeliveryTotals(FromDate: any, ToDate: any): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Transactions/DeliveryTotals?FromDate=${FromDate}&ToDate=${ToDate}`,
      this.httpOptions
    );
  }

  getElectronicTotals(AsAtDate: any): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Transactions/ElectronicTotals?AsAtDate=${AsAtDate}`,
      this.httpOptions
    );
  }
}

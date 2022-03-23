import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TerminalsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('flexapiuser@felxapi.com:f!3x@P1u8eRUt'),
    }),
  };

  constructor(private http: HttpClient) {}

  postPriceSign(searchQuery: any): Observable<any[]> {
    return this.http.post<any>(
      `${environment.apiURL}/PriceSign`,
      searchQuery,
      this.httpOptions
    );
  }

  getPriceSign(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/PriceSign`,
      this.httpOptions
    );
  }

  getAllTerminals(): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/Terminals`,
      this.httpOptions
    );
  }
}

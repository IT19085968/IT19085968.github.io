import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('flexapiuser@felxapi.com:f!3x@P1u8eRUt'),
    }),
  };

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiURL}/User`, this.httpOptions);
  }

  fetchUserById(userID: string): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/User/${userID}`,
      this.httpOptions
    );
  }

  updateUser(user: User): Observable<any[]> {
    return this.http.put<any>(
      `${environment.apiURL}/User`,
      user,
      this.httpOptions
    );
  }

  createUser(user: User): Observable<any[]> {
    return this.http.post<any>(
      `${environment.apiURL}/User`,
      user,
      this.httpOptions
    );
  }
}

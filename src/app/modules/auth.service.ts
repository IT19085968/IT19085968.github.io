import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../environments/environment.prod';
import { User } from '../shared/models/User';

export const AUTH_TOKEN_KEY = 'auth-token';
export const AUTH_USER_DATA = 'user-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('flexapiuser@felxapi.com:f!3x@P1u8eRUt'),
    }),
  };

  user: User = {
    id: '',
    userName: '',
    password: '',
    isActive: '',
  };

  public authToken: string | null = null;
  public userData: User | null = null;

  constructor(private http: HttpClient) {
    this.checkStorage();
  }

  checkStorage() {
    const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const userData = sessionStorage.getItem(AUTH_USER_DATA);
    this.authToken = authToken;
    if (userData) {
      this.userData = JSON.parse(userData) as any;
    } else {
      this.userData = null;
    }
  }

  fetchUserById(userID: string): Observable<any[]> {
    return this.http.get<any>(
      `${environment.apiURL}/User/${userID}`,
      this.httpOptions
    );
    // .subscribe((data) => {
    //   if (data.length > 0) {
    //     this.user = data[0];
    //     sessionStorage.setItem(AUTH_TOKEN_KEY, this.user.id);
    //     sessionStorage.setItem(AUTH_USER_DATA, JSON.stringify(this.user));
    //     this.checkStorage();
    //     console.log('session', sessionStorage);
    //   }
    // });
  }

  setSessionStorage(user: User): void {
    sessionStorage.setItem(AUTH_TOKEN_KEY, user.id);
    sessionStorage.setItem(AUTH_USER_DATA, JSON.stringify(user));
    this.checkStorage();
    console.log('session', sessionStorage);
  }

  public isLoggedIn() {
    return this.authToken !== null;
  }

  public logOut() {
    if (!this.isLoggedIn()) return;
    sessionStorage.clear();
    this.checkStorage();
  }
}

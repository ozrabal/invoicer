import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import {catchError} from "rxjs/operators";
import { Login, LoginResponse, LoginSuccess } from '../../types';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(body: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:3002/auth/login', body)
    .pipe(
      catchError(error => {
        if (error.status === 401) {
          return of({message: 'Invalid credentials'});
        }
        return of()
      }),
      tap(data => {
        const loginSuccessData = data as LoginSuccess;
      })
    );
  }

  logout() {
  }

  storeToken(token: string) {
  }
}

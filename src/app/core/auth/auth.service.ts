import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import {catchError} from "rxjs/operators";
import { Login, LoginResponse, LoginSuccess } from '../../types';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

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
        if (loginSuccessData.token) {
          this.storeToken(loginSuccessData);
          this.router.navigate(['/']);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  storeToken(data: LoginSuccess) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
}

import { inject, Injectable, DestroyRef } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError } from "rxjs/operators";
import { Login, LoginResponse, LoginSuccess } from '../../types';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly destroyRef = inject(DestroyRef);

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

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logout();
      return of();
    }
    return this.http.post<LoginResponse>('http://localhost:3002/auth/refresh', {refreshToken})
    .pipe(
      catchError(error => {
        this.logout();
        return of();
      }),
      tap(data => {
        const loginSuccessData = data as LoginSuccess;
        if (loginSuccessData.token) {
          this.storeToken(loginSuccessData);
          this.scheduleRefreshToken(loginSuccessData.token);
        }
      })
    );
  }

  scheduleRefreshToken(token: string): void {
    const expirationTime = this.jwtHelper.getTokenExpirationDate(token)?.getTime();
    const refreshTime = expirationTime ? expirationTime - this.TOKEN_EXPIRY_THRESHOLD_MINUTES * 60 * 1000: Date.now();
    const refreshInterval = expirationTime ? expirationTime - refreshTime : 0;

    if (refreshInterval > 0) {
      setTimeout(() => {
        this.refreshToken()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }, refreshInterval);
    }
  }
}

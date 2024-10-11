import { HttpContextToken, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { switchMap } from "rxjs/operators";

export const authInterceptor: HttpInterceptorFn  = (req, next) => {
  const authService = inject(AuthService);

  if (req.context.get(IS_PUBLIC)) {
    return next(req);
  }

  if (authService.isAuthenticated()) {
    const authRequest = addAuthHeader(req);
    return next(authRequest);
  } else {
    return authService.refreshToken().pipe(
      switchMap(() => {
        const authRequest = addAuthHeader(req);
        return next(authRequest);
      })
    );
  }
};

const addAuthHeader = (req: HttpRequest<any>) => {
  const token = localStorage.getItem('token');
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
}

export const IS_PUBLIC = new HttpContextToken<boolean>(() => false);

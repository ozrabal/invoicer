import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {JwtModule} from "@auth0/angular-jwt";
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthService } from './core/auth/auth.service';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('token')
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      deps: [AuthService],
      multi: true
    }
  ]
};

export function initializerFactory(authService: AuthService) {
  return () => {
    authService.refreshToken().subscribe();
  };
}

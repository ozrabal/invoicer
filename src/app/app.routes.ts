import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Invoicer',
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login',
  },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { authGuard } from './core/auth/auth.guard';
import { accountGuard } from './core/auth/account.guard';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
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
    canActivate: [accountGuard]
  },
];

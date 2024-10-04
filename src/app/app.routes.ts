import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Invoicer',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login',
  },
];

import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit {
    loginForm!: FormGroup;
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly destoyRef = inject(DestroyRef);

    constructor() { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    onSubmit() {
      if (!this.loginForm.valid) {
        return;
      }
      const loginData = this.loginForm.value;
      this.authService.login(loginData)
        .pipe(takeUntilDestroyed(this.destoyRef)).subscribe();

    }

}

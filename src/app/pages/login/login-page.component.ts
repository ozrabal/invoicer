import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


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

      console.log(this.loginForm.value);
    }

}

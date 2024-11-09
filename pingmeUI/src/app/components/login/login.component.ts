import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../services/accountService.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/userService.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {}

  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  userModel: any = { Username: '', Password: '' };
  onSubmit() {
    console.log('onSubmit called');
    if (this.loginForm.valid) {
      console.log('loginForm valid');
      this.userModel = {
        Username: this.loginForm.value.username,
        Password: this.loginForm.value.password,
      };
      this.accountService.login(this.userModel).subscribe({
        next: (user) => {
          console.log('User LoggedIn:', user);
          this.toastr.success(this.userModel.Username + 'Logged In!','Login success !');
          this.userService.setCurrentUser(user);
          this.router.navigate(['/chats']);

        },
        error: (err) => {
          this.toastr.error(err.error.message + ' !','Login Error !');
          console.error('LoggedIn error:', err);
        },
      });
    }
  }
}

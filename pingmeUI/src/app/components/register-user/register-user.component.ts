import { Component, inject } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/userService.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AccountService } from '../../services/accountService.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  constructor(private http: HttpClient) { }
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  currentIp: string = '';

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  user: Partial<User> = { username: '', passwordHash: '' }; // Partial to initialize without all fields

  ngOnInit(): void {
    this.getCurrentIp().subscribe(ip => {
      if (ip) {
        this.currentIp = ip;
        console.log('Current IP:', this.currentIp); // Log the received IP
      } else {
        console.log('No IP received'); // Log if no IP was received
      }
    });
  }

  getCurrentIp(): Observable<string> {
    return this.accountService.getCurrentIp().pipe(
      catchError(error => {
        console.error('Error fetching IP:', error);
        return of(''); // Handle error
      })
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.getCurrentIp().subscribe({
        next: (ip) => {
          const user: User = {
            id: uuidv4(),
            username: this.registerForm.value.username,
            passwordHash: this.registerForm.value.password, // Ensure to hash the password
            connectionId: ip, // Use the fetched IP
            token: ''
          };

          this.accountService.registerUser(user).subscribe({
            next: (user) => {
              this.toastr.success('User registered!', user.username + ' registered!');
              console.log('User registered:', user);
            },
            error: (err) => {
              this.toastr.error('Registration error!', user.username + ' Registration Failed!');
              console.error('Registration error:', err)
            },
          });
        },
        error: (err) => console.error('Error fetching IP:', err),
      });
    }
  }
}



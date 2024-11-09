import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserComponent } from "./components/user/user.component";
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './services/accountService.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ UserComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private toastr: ToastrService) {}
  title = 'pingmeUI';
  private accountService = inject(AccountService);
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }


}


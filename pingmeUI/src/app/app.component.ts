import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserComponent } from "./components/user/user.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ UserComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'pingmeUI';

}


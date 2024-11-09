import { UserComponent } from './components/user/user.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
{ path: '', component: LoginComponent },
{ path: 'register', component:RegisterUserComponent },
{ path: 'users', component:UserComponent },
{ path: 'chats', component:ChatComponent },
];

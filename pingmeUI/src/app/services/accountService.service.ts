import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl =environment.apiUrl;
  currentUser = signal<User | null>(null);
  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl+ 'Register'}`, user);
  }
  
  getCurrentIp(): Observable<string> {
    return this.http.get('https://ipapi.co/ip/', { responseType: 'text' }).pipe(
      map(response => {
        // The response is a plain text string containing the IP
        const ip = response.trim(); // Trim any whitespace
        console.log('Fetched IP:', ip); // Log the received IP
        return ip; // Return the IP
      }),
      catchError(error => {
        console.error('Error fetching IP:', error);
        return of(''); // Handle error by returning an empty string
      })
    );
  }

  login(model: any) {
    console.log('User req:', model);
    return this.http.post<any>(this.baseUrl + 'Login/login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);  // store the user in localStorage or some other method
          console.log('User res:', user);
          return user; // Return the user object
        }
      })
    );
  }
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
  

}

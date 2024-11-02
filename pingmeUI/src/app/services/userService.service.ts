import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiUrl = 'http://localhost:5116/api/Users'
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, user);
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
  

}

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl =environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient) { }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl+ 'Users');
  }

}

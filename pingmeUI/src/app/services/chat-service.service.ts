import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection;
  private messagesSource = new BehaviorSubject<{ user: string; message: string; timestamp: string }[]>([]);
  messages$ = this.messagesSource.asObservable();
  private activeUsersSource = new BehaviorSubject<{ username: string, connectionId: string }[]>([]);
  activeUsers$ = this.activeUsersSource.asObservable();

  // Explicitly typing the message history map to store user message histories
  private messageHistoryMap = new Map<string, BehaviorSubject<{ senderId: string; content: string }[]>>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5116/chatHub')
      .withAutomaticReconnect()
      .build();


      this.hubConnection.on('ReceiveMessage', (user: string, message: string, timestamp: string) => {
        this.addMessageToHistory(user, message, timestamp);
      });
  }

  startConnection(userId: string) {
    this.hubConnection.start()
      .then(() => {
        console.log('Connected to SignalR');
        this.registerUser(userId);
      })
      .catch((err) => {
        console.error('Error connecting to SignalR:', err);
        alert('Connection error: ' + err);
      });
  }

  sendMessage(receiverConnectionId: string, message: string) {
    this.hubConnection
      .invoke('SendMessage', receiverConnectionId, message)
      .catch((err) => console.error('SendMessage Error:', err));
  }

  registerUser(userId: string) {
    this.hubConnection
      .invoke('RegisterUser', userId)
      .catch((err) => console.error('RegisterUser Error:', err));
  }

  private addMessageToHistory(userId: string, message: string, timestamp: string) {
    if (!this.messageHistoryMap.has(userId)) {
      // Define the type explicitly here
      this.messageHistoryMap.set(userId, new BehaviorSubject<{ senderId: string; content: string }[]>([]));
    }
    const userMessages = this.messageHistoryMap.get(userId)!;
    const updatedMessages = [...userMessages.value, { senderId: userId, content: message }];
    userMessages.next(updatedMessages);
  }

  getMessageHistory(userId: string): Observable<{ senderId: string; content: string }[]> {
    if (!this.messageHistoryMap.has(userId)) {
      // Define the type explicitly here
      this.messageHistoryMap.set(userId, new BehaviorSubject<{ senderId: string; content: string }[]>([]));
    }
    return this.messageHistoryMap.get(userId)!.asObservable();
  }
  private addActiveUser(username: string, connectionId: string) {
    const currentUsers = this.activeUsersSource.getValue();
    if (!currentUsers.find(u => u.connectionId === connectionId)) {
      this.activeUsersSource.next([...currentUsers, { username, connectionId }]);
    }
  }

  private removeActiveUser(username: string) {
    const currentUsers = this.activeUsersSource.getValue();
    this.activeUsersSource.next(currentUsers.filter(u => u.username !== username));
  }
}

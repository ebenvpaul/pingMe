// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/userService.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]  // Import CommonModule to use ngClass
})


export class ChatComponent implements OnInit {
  users: User[] = [];  // Assume this is populated with user data
  selectedUser: User | null = null;
  activeUsers: { username: string, connectionId: string }[] = [];
  messageHistory: { sender: string; content: string }[] = [];
  newMessage: string = '';
  username !: string;
  userId!: string;

  ngOnInit(): void {
    this.loadUsers();
    this.chatService.activeUsers$.subscribe(users => {
      this.activeUsers = users;
    });

    this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.userId = user.id;
        console.log('User Info from Service:', this.username, this.userId);
      } else {
        // If no user is logged in, you can redirect or show an error
        console.log('No user logged in');
      }
    });

  }
  constructor(private chatService: ChatService,private userService: UserService) {
    this.chatService.startConnection(this.userId);
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users', err);
      },
    });
  }

  // Method to check if the user is active
  isUserActive(username: string): boolean {
    return this.activeUsers.some(u => u.username === username);
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.loadMessageHistory(user);
  }

  loadMessageHistory(user: User): void {
    this.chatService.getMessageHistory(user.id).subscribe((messages) => {
      this.messageHistory = messages.map(msg => ({
        sender: msg.senderId === this.selectedUser?.id ? 'other' : 'self',
        content: msg.content
      }));
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUser) {
      this.chatService.sendMessage(this.selectedUser.id, this.newMessage);
      this.newMessage = '';
    }
  }
}
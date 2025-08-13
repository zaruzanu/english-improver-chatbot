import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
selector: 'app-register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})
export class RegisterComponent {
userObj: { username: string; email: string; password: string } = {
  username: '',
  email: '',
  password: ''
};

constructor(private router: Router) {}

onregister(): void {
  let users = JSON.parse(localStorage.getItem('users') || '[]'); // Retrieve existing users
  if (!Array.isArray(users)) {
    users = []; // Ensure 'users' is an array
  }

  // Check if user already exists to prevent duplicate registration
  const existingUser = users.find((u: { email: string }) => u.email === this.userObj.email);
  if (existingUser) {
    alert('User already exists. Try logging in.');
    this.router.navigateByUrl('login'); // Redirect to 'login' if user already exists
    return;
  }

  // Add new user to the array
  users.push({
    username: this.userObj.username,
    email: this.userObj.email,
    password: this.userObj.password
  });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful. Redirecting to login...');
  this.router.navigateByUrl('login'); // Navigate to 'login' after successful registration
}
}

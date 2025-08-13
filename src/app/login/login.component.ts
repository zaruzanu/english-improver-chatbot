import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userObj = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  onlogin(): void {
    const users: { email: string; password: string }[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (!Array.isArray(users) || users.length === 0) {
      alert('No registered users found.');
      this.router.navigateByUrl('register');
      return;
    }
    console.log(users);
    const user = users.find(
      u => u.email === this.userObj.email && u.password === this.userObj.password
    );
    console.log(user);
    if (user) {
      // ✅ Save email so navbar knows user is logged in
      localStorage.setItem('email', user.email);

      alert('Login successful');
      this.router.navigateByUrl('home'); // Redirect to home
    } else {
      alert('Invalid credentials. Redirecting to register...');
      this.router.navigateByUrl('register');
    }
  }
}

import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent  {
  isEmailProvided = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isEmailProvided = !!localStorage.getItem('email');
  }

  logout(): void {
    localStorage.removeItem('email');
    this.isEmailProvided = false;
    this.router.navigate(['/login']);
  }
}

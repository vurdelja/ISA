import { Component, OnInit } from '@angular/core';
import { User, UserRole } from 'src/app/modules/user.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;
  currentUser: User | undefined;
  UserRole = UserRole;
  showOptions: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    const token = localStorage.getItem("jwt");

    if (token) {
      // Decode the token to get user information
      this.user = this.jwt_decode(token);
      console.log("Decoded user:", this.user);

      if (this.user && this.user.Id) {
        // Fetch user details using the user ID from the token
        this.authService.getUserById(Number(this.user.Id)).subscribe({
          next: (result: User) => {  
            this.currentUser = result;
            console.log('Data user:', this.currentUser);
          },
          error: (error) => {
            console.error('API error:', error);
            // Handle error as needed
          }
        });
      } else {
        console.error("Decoded token does not contain user ID");
      }
    } else {
      console.error("Token not found in localStorage");
    }
  }

  private jwt_decode(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    
    const currentUnixTime = Math.round((new Date()).getTime() / 1000);
    if (decoded.exp < currentUnixTime) {
      console.error("Token expired");
      this.logout();
      return null;
    }
    return decoded;
  }
  

  logout(): void {
    localStorage.removeItem("jwt");
    this.router.navigate(['/login']);
  }
  

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
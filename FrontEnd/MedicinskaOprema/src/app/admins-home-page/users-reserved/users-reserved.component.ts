import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/modules/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-reserved',
  templateUrl: './users-reserved.component.html',
  styleUrls: ['./users-reserved.component.css']
})
export class UsersReservedComponent {

  companyId: number = 0;
  usersWhoReserved: User[] = [];

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));

    
    this.authService.getUsersWhoReserved(this.companyId).subscribe({
      next: (result: User[]) => {  
          this.usersWhoReserved = result;
          console.log('users who reserved:', this.usersWhoReserved);
      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
    });
  }
}

// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User, UserRole } from 'src/app/modules/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  userList: User[] = [];
  showAddUserForm = false;
  newUser: User = {
    userID: 0,
    email: '',
    password: '',
    userRole: UserRole.REGISTER_USER, // Set an appropriate default UserRole enum value
    name: '',
    surname: '',
    companyId: 0, // Set companyId to an appropriate default value
    isPredefined: false, // Set isPredefined to an appropriate default value
    penaltyScore: 0 // Set penaltyScore to an appropriate default value
  };
  userForm!: FormGroup;
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadUsers();
  
    // Inicijalizujte Reactive Form
    this.initForm();
  }
  
  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // Dodajte ostala polja prema potrebi
    });
  }
  


  loadUsers(): void {
    this.authService.GetAllSysAdmin().subscribe({
      next: (result: User[]) => {
        this.userList = result;
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });
  }

  openAddUserModal(): void {
    this.showAddUserForm = true;
  }

  addUser(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      // Kreirajte objekat User sa podacima iz forme
      const newUser: User = {
        userID: 0, // Postavite na odgovarajuću vrednost
        password: formValue.password,
        userRole: 2, // Izbacite polje za ulogu ili postavite vrednost prema potrebi
        name: formValue.name,
        surname: formValue.surname,
        email: formValue.email,
        companyId: 0, // Set companyId to an appropriate default value
        isPredefined: false, // Set isPredefined to an appropriate default value
        penaltyScore: 0 // Set penaltyScore to an appropriate default value
      };

      // Pozovite metodu CreateSystemAdmin iz AuthService koristeći novog korisnika
      this.authService.CreateSystemAdmin(newUser).subscribe({
        next: (result: User[]) => {
          console.log('Korisnik uspešno dodat.');
          this.loadUsers();
          this.showAddUserForm = false;
        },
        error: (error) => {
          console.error('Greška prilikom dodavanja korisnika:', error);
        }
      });
    }
  }
  
  
  
}

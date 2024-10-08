import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from 'src/app/modules/person.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/modules/user.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-profile-editing',
  templateUrl: './admin-profile-editing.component.html',
  styleUrls: ['./admin-profile-editing.component.css']
})
export class AdminProfileEditingComponent {
  
  constructor(private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      profession: ['', Validators.required],
      companyInfo: ['', Validators.required],
      memberSince: ['', Validators.required],
    });
  }
  person: any | null = null;
  profileForm: FormGroup;
  user: User | null = null;
  currentUserId: number = 0;
  currentUser: any;  

  ngOnInit(): void {
    this.currentUserId = Number(this.route.snapshot.paramMap.get('userId'));
    this.authService.getAdminById(Number(this.currentUserId)).subscribe({
      next: (result: any) => {  
          this.person = result;
          console.log('Data user:', this.person);
          this.populateForm();
      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
      

    });
  } 

  populateForm(): void {
    if (this.person) {
      this.profileForm.patchValue(this.person);
    }
  }
  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedPerson: Person = {
        // Map the form values to the Person object
        UserID: this.person?.userID || 0, // Use existing UserID or provide a default value
        ...this.profileForm.value
      };
  
      // Call the updateAdmin method in your AuthService
      this.authService.updateAdmin(updatedPerson).subscribe({
        next: () => {
          console.log('Admin updated successfully.');
          // You can add any additional logic here, such as showing a success message.
        },
        error: (error) => {
          console.error('Error updating admin:', error);
          // Handle the error, display an error message, etc.
        }
      });
    }
  }
  
}

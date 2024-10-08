import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from 'src/app/modules/person.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile-editing',
  templateUrl: './user-profile-editing.component.html',
  styleUrls: ['./user-profile-editing.component.css']
})
export class UserProfileEditingComponent implements OnInit {
  person: Person | null = null;
  profileForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      penaltyPoints: ['', Validators.required],
      category: ['SILVER', Validators.required], // Default category to SILVER
      benefits: [{value: 'Discount 20% on everything', disabled: true}], // Default benefits for SILVER
    });
  }

  ngOnInit(): void {
    console.log('UserProfileEditingComponent initialized');
    // Fetch the current user and populate the form
    this.authService.currentUser.subscribe(user => {
      console.log('Current user:', user);
      if (user && user.userID) {
        console.log(`Fetching person data for UserID: ${user.userID}`);
        this.authService.getPersonByUserId(user.userID).subscribe({
          next: (result: Person) => {
            console.log('Person data fetched successfully:', result);
            this.person = result;
            this.populateForm();
          },
          error: (error) => {
            console.error('API error fetching person data:', error);
          }
        });
      } else {
        console.warn('No current user or UserID not found');
      }
    });
  }

  populateForm(): void {
    if (this.person) {
      console.log('Populating form with person data:', this.person);
      this.profileForm.patchValue({
        email: this.person.email,
        name: this.person.name,
        surname: this.person.surname,
        city: this.person.city,
        country: this.person.country,
        phone: this.person.phone,
        penaltyPoints: '25',
        category: 'SILVER', // Use default if not set
        benefits: this.getBenefits('SILVER') // Set benefits based on category
      });
    } else {
      console.warn('No person data to populate the form');
    }
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    const benefits = this.getBenefits(category);
    this.profileForm.patchValue({ benefits: benefits });
  }

  getBenefits(category: string): string {
    switch (category) {
      case 'GOLD':
        return 'Discount 30% on everything';
      case 'REGULAR':
        return 'Discount 10% on everything';
      case 'SILVER':
      default:
        return 'Discount 20% on everything';
    }
  }

  onSubmit(): void {
    console.log('Form submission triggered');
    if (this.profileForm.valid) {
      console.log('Form is valid, preparing to update person');

      // Merge existing person data with the form values
      const updatedPerson: Person = {
        ...this.person, // Existing person data
        ...this.profileForm.value, // Form values
        UserID: this.person?.userID || 0, // Ensure UserID is not changed
        email: this.person?.email || '', // Ensure email is not changed
        password: this.person?.password || '', // Ensure password is not changed
        profession: this.person?.profession || '', // Retain the existing profession
        companyInfo: this.person?.companyInfo || '', // Retain the existing company info
        memberSince: this.person?.memberSince || new Date(), // Retain the existing member since date
        isActivated: this.person?.isActivated || false // Retain the existing activation status
      };

      console.log('Updated person data:', updatedPerson);

      this.authService.updateRegisteredUser(updatedPerson).subscribe({
        next: () => {
          console.log('User updated successfully.');
          // Add any additional logic here, such as showing a success message.
        },
        error: (error) => {
          console.error('Error updating user:', error);
          // Handle the error, display an error message, etc.
        }
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}

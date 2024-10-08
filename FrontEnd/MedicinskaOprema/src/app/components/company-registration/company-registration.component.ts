import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { User} from 'src/app/modules/user.model';
import { Company, Company1 } from 'src/app/modules/company.model';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent implements OnInit {
  
  
  compregistrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    adress: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    description: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    adminId: new FormControl('', Validators.required),
    openingTime: new FormControl('', Validators.required), // Add opening time field
    closingTime: new FormControl('', Validators.required), // Add closing time field
});


  users: User[] = [];

  constructor(private companyService: CompanyService) {}

  registerSubmited() {
    console.log("Submitted successfully");
    const openingTimeValue = this.compregistrationForm.value.openingTime;
    const closingTimeValue = this.compregistrationForm.value.closingTime;
    const selectedUserId = this.compregistrationForm.value.adminId;
    if (openingTimeValue !== null && openingTimeValue !== undefined &&
      closingTimeValue !== null && closingTimeValue !== undefined) {
    const companyData: Company1 = {
        name: this.compregistrationForm.value.name || '',
        address: this.compregistrationForm.value.adress || '',
        description: this.compregistrationForm.value.description || '',
        administrators: [Number(this.compregistrationForm.value.adminId)],
        openingTime: this.formatTime(openingTimeValue), // Include opening time
        closingTime: this.formatTime(closingTimeValue),  // Include closing time
    };
    
    console.log("Company Data:", companyData);

    this.companyService.companyreg(companyData, Number(this.compregistrationForm.value.adminId)).subscribe(
        () => {
            console.log("Company registered successfully.");
            // Add logic to handle successful registration
        },
        (error) => {
            console.error(error);
            // Add logic to handle registration errors
        }
    );
}
  }
formatTime(time: string): string {
  // Split the time string to extract hours and minutes
  const [hours, minutes] = time.split(':');

  // Ensure two-digit formatting for hours and minutes
  const formattedHours = ('0' + hours).slice(-2);
  const formattedMinutes = ('0' + minutes).slice(-2);

  // Return the time in the "hh:mm:ss" format
  return `${formattedHours}:${formattedMinutes}:00`;
}

  get Name(): FormControl {
    return this.compregistrationForm.get('name') as FormControl;
  }

  get Adress(): FormControl {
    return this.compregistrationForm.get('adress') as FormControl;
  }

  get Description(): FormControl {
    return this.compregistrationForm.get('description') as FormControl;
  }

  get AdminId(): FormControl {
    return this.compregistrationForm.get('adminId') as FormControl;
  }

  get OpeningTime(): FormControl {
    return this.compregistrationForm.get('openingTime') as FormControl;
  }
  
  get ClosingTime(): FormControl {
    return this.compregistrationForm.get('closingTime') as FormControl;
  }

  convertToTimeSpan(timeString: string): string {
    // Razdvajanje vrednosti sata i minuta
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // Kreiranje TimeSpan objekta
    const timeSpan = new Date(0, 0, 0, hours, minutes, 0);

    return timeSpan.toString(); // Vraćanje u formatu koji server očekuje
  }
  ngOnInit(): void {
    // Dohvati korisnike određene uloge prilikom inicijalizacije komponente
    this.companyService.getUsersByRole().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
}

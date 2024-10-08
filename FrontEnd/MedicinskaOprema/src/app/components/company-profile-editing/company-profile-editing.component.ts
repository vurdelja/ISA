import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Appointment, AppointmentStatus } from 'src/app/modules/appointment.model';
import { Company } from 'src/app/modules/company.model';
import { Equipment } from 'src/app/modules/equipment.model';
import { User } from 'src/app/modules/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-company-profile-editing',
  templateUrl: './company-profile-editing.component.html',
  styleUrls: ['./company-profile-editing.component.css']
})
export class CompanyProfileEditingComponent {
  companyId: number = 0; // Initialize with a default value or use a meaningful default
  company: any;
  equipmentList: Equipment[] = [];
  appointmentList: Appointment[] = [];
  currentUserId: number = 0;
  currentUser: any;  

  constructor( private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder  ) { 

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
      averageRating: ['', Validators.required],
      openingTime: new FormControl('', Validators.required), // Changed here
      closingTime: new FormControl('', Validators.required), // Changed here
    });
  }
  companyForm: FormGroup;
  showAppointmentForm: boolean = false; 

  appointmentForm = new FormGroup({
    start: new FormControl('', [Validators.required]),
    startTime: new FormControl(['', Validators.required]),
    duration: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),  
  });

  ngOnInit(): void {
    // Use 'id' instead of 'companyid'
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = Number(this.route.snapshot.paramMap.get('userId'));
  
    this.authService.getCompanyById(this.companyId).subscribe(
      (companyData: any) => {
        this.company = companyData;
        this.populateForm();
  
        // Now that companyData is available, call getEquipmentByCompanyId
        this.authService.getEquipmentByCompanyId(this.company.id).subscribe(
          (equipmentData: Equipment[]) => {
            this.equipmentList = equipmentData; 
            console.log('Company Details:', this.company);
            console.log('time:', this.company.openingTime.minutes);
          },
          (equipmentError: any) => {
            console.error('Error fetching equipment list:', equipmentError);
          }
        );
        this.authService.getAppointmentsByCompanyId(this.company.id).subscribe(
          (appointmentData: Appointment[]) => {
            this.appointmentList = appointmentData;
            console.log('Appointment List:', this.appointmentList);
          },
          (appointmentError: any) => {
            console.error('Error fetching equipment list:', appointmentError);
          }
        );
      },
      (companyError: any) => {
        console.error('Error fetching company details:', companyError);
      }
    );
  }
  populateForm(): void {
    if (this.company) {
      this.companyForm.patchValue({
        name: this.company.name,
        address: this.company.address,
        description: this.company.description,
        averageRating: this.company.averageRating,
        openingTime: this.company.openingTime,
        closingTime: this.company.closingTime
      });
    }
  }

  save(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;


      const updatedCompany: Company = {
        id: this.company.id, // Assuming company.id exists
        name: formData.name,
        address: formData.address,
        description: formData.description,
        averageRating: formData.averageRating,
        openingTime: formData.openingTime + "00",
        closingTime: formData.closingTime + "00",
        otherAdministrators: this.company.otherAdministrators,
        equipment: this.company.equipment,
        equipmentId: this.company.equipmentId
      };
      console.log('date .', formData.openingDate);

  
      // Call the updateAdmin method in your AuthService
      this.authService.updateCompany(this.company.id,updatedCompany).subscribe({
        next: () => {
          console.log('Company updated successfully.');
          // You can add any additional logic here, such as showing a success message.
        },
        error: (error) => {
          console.error('Error updating Company:', error);
          // Handle the error, display an error message, etc.
        }
      });
    }
  }
  toggleAppointmentForm(): void {
    this.showAppointmentForm = !this.showAppointmentForm;
  }

  addAppointment(): void {
    if (this.appointmentForm.valid) {
      const startDateTime = new Date(
        this.appointmentForm.value.start + 'T' + this.appointmentForm.value.startTime
      );
      const newAppointment: Appointment = {
        start: startDateTime.toISOString(),
        duration: this.appointmentForm.value.duration as number,
        administratorsId: this.currentUserId,
        companyId: this.companyId,
        reservationId: 0,
        endTime: startDateTime.toISOString(),
      };

      console.log('Form submitted with:', newAppointment);
      //add u bazu
      this.authService.addAppointment(newAppointment).subscribe(
        () => {
          console.log("Appointment added successfully.");
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.log('Form is invalid. Please check the inputs.');
    }
  }
}

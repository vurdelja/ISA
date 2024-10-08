import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Appointment } from 'src/app/modules/appointment.model';
import { Equipment } from 'src/app/modules/equipment.model';
import { AuthService } from 'src/app/services/auth.service';

import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { User, UserRole } from 'src/app/modules/user.model';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  companyId: number = 0; 
  company: any;
  equipmentList: Equipment[] = [];
  otherAdmins: User[] = [];
  currentUserId: number = 0;
  currentUser: any;  
  UserRole = UserRole;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  appointmentList: Appointment[] = [];
  showAppointmentList: boolean = false;
  showAppointmentForm: boolean = false; 

  appointmentForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    duration: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),
    equipmentId: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),
  });



  ngOnInit(): void {
    
    // Use 'id' instead of 'companyid'
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.currentUserId = Number(this.route.snapshot.paramMap.get('userId'));
    
    console.log('Current user:', this.currentUserId);
    this.authService.getCompanyById(this.companyId).subscribe(
      (companyData: any) => {
        this.company = companyData;
  
        // Now that companyData is available, call getEquipmentByCompanyId
        this.authService.getEquipmentByCompanyId(this.company.id).subscribe(
          (equipmentData: Equipment[]) => {
            this.equipmentList = equipmentData;
  
            console.log('Company Details:', this.company);
            console.log('Equipment List:', this.equipmentList);
          },
          (equipmentError: any) => {
            console.error('Error fetching equipment list:', equipmentError);
          }
        );
        //appointments
        this.authService.getAppointmentsByCompanyId(this.company.id).subscribe(
          (appointmentData: Appointment[]) => {
            this.appointmentList = appointmentData;
            console.log('Appointment List:', this.appointmentList);
          },
          (appointmentError: any) => {
            console.error('Error fetching equipment list:', appointmentError);
          }
        );
        this.authService.getOtherAdmins(this.currentUserId, this.company.id).subscribe(
          (userData: User[]) => {
            this.otherAdmins = userData;
    
            console.log('Admin Details:', this.otherAdmins);
          },
          (userError: any) => {
            console.error('Error fetching admin list:', userError);
          }
        );
      },
      (companyError: any) => {
        console.error('Error fetching company details:', companyError);
      }
    );
    this.authService.getUserById(Number(this.currentUserId)).subscribe({
      next: (result: any) => {  
          this.currentUser = result;
          console.log('Data user:', this.currentUser);
      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
      

    });
  }
  
  toggleAppointmentList(): void {
    this.showAppointmentList = !this.showAppointmentList;
  }

  toggleAppointmentForm(): void {
    this.showAppointmentForm = !this.showAppointmentForm;
  }

  navigateToExtra(): void{
    this.router.navigate(['/extraordinary-appointment']);
  }

  addAppointment(): void {
    if (this.appointmentForm.valid) {
      const newAppointment: Appointment = {
        duration: this.appointmentForm.value.duration as number,
        administratorsId: this.currentUserId,
        companyId: this.companyId,
        reservationId: 0,
        start: '3',
        endTime: '2'
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

  rateCompany(): void {
    this.authService.hasReservation(this.currentUserId, this.companyId).subscribe(
      hasReservation => {
        if (hasReservation) {
          this.router.navigate(['/company-rating', this.companyId]);
        } else {
          alert('You had no reservations with this company');
        }
      },
      error => {
        console.error('Error checking reservation:', error);
      }
    );
  }




}

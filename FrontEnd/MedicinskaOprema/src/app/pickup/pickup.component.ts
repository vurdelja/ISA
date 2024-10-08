import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Equipment } from 'src/app/modules/equipment.model';
import { Appointment } from 'src/app/modules/appointment.model';
import { User } from '../modules/user.model';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.css']
})
export class PickupComponent implements OnInit {
  companyId: number = 0;
  user: any;
  currentUser: User | undefined;
  equipmentList: Equipment[] = [];
  selectedEquipment: Equipment[] = [];
  appointmentList: Appointment[] = [];
  extraordinaryAppointments: Appointment[] = [];
  showCalendar: boolean = false;
  company: any;
  today: string = new Date().toISOString().split('T')[0];
  selectedAppointment: Appointment | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
    this.fetchCompanyDetails();
    this.fetchEquipment();
    this.fetchAppointments();

    const token = localStorage.getItem("jwt");

    if (token) {
      this.user = this.jwt_decode(token);
      console.log("User information:", this.user.Id);

      this.authService.getUserById(Number(this.user.Id)).subscribe({
        next: (result: any) => {  
            this.currentUser = result;
            console.log('Data user:', this.currentUser);
        },
        error: (error) => {
          console.error('API error:', error);
        }
      });
    } else {
      console.error("Token not found in localStorage");
    }
  }

  fetchCompanyDetails(): void {
    this.authService.getCompanyById(this.companyId).subscribe(
      (companyData: any) => {
        this.company = companyData;
      },
      (error: any) => {
        console.error('Error fetching company details:', error);
      }
    );
  }

  fetchEquipment(): void {
    this.authService.getEquipmentByCompanyId(this.companyId).subscribe(
      (equipmentData: Equipment[]) => {
        this.equipmentList = equipmentData;
        console.log('Equipment List:', this.equipmentList);
      },
      (error: any) => {
        console.error('Error fetching equipment list:', error);
      }
    );
  }

  fetchAppointments(): void {
    this.authService.getAppointmentsByCompanyId(this.companyId).subscribe(
      (appointmentData: Appointment[]) => {
        this.appointmentList = appointmentData;
        console.log('Appointment List:', this.appointmentList);
      },
      (error: any) => {
        console.error('Error fetching appointment list:', error);
      }
    );
  }

  
  private jwt_decode(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    return decoded;
  }

  addEquipment(equipment: Equipment): void {
    this.selectedEquipment.push(equipment);
  }

  chooseExtraordinary(): void {
    this.showCalendar = true;
  }

  onDateChange(event: any): void {
    const selectedDate = event.target.value;
    this.fetchExtraordinaryAppointments(selectedDate);
  }

  fetchExtraordinaryAppointments(date: string): void {
    this.authService.getExtraordinaryAppointments(this.companyId, date).subscribe(
      (appointments: Appointment[]) => {
        this.extraordinaryAppointments = appointments;
        console.log('Extraordinary Appointments:', this.extraordinaryAppointments);
      },
      (error: any) => {
        console.error('Error fetching extraordinary appointments:', error);
      }
    );
  }

  selectAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  confirmReservation(): void {
    if (this.selectedAppointment && this.selectedEquipment.length > 0 && this.currentUser) {
      const reservation = {
        userId: this.currentUser.userID,
        equipmentIds: this.selectedEquipment.map(e => e.id),
        isCollected: false,
        companyId: this.companyId,
        appointmentDate: this.selectedAppointment.start,
        appointmentDuration: 60,
        appointmentTime: this.selectedAppointment.start,
      };
  
      console.log('Attempting to create reservation for user email:', this.currentUser.email); // Log user email

      this.authService.createPickupReservation(reservation).subscribe(
        response => {
          console.log('Reservation created successfully:', response);
          console.log('Confirmation email sent to:', this.currentUser?.email); // Log user email after successful creation
          alert('Reservation confirmed. Check your email for details.');
          // Handle success, perhaps redirect or show a success message
        },
        error => {
          console.error('Error creating reservation:', error);
          alert('Failed to create reservation. Please try again.');
          // Handle error, perhaps show an error message
        }
      );
    }
  }
}

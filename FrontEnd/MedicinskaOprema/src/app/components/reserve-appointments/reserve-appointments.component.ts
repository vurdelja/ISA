import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/modules/appointment.model';
import { Reservation } from 'src/app/modules/reservation.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reserve-appointments',
  templateUrl: './reserve-appointments.component.html',
  styleUrls: ['./reserve-appointments.component.css']
})
export class ReserveAppointmentsComponent {
  companyId: number = 0;
  company: any;
  appointmentList: Appointment[] = [];
  userId: number = 0; 
  number: number = 0; 
  showForm: boolean = false;
  selectedAppointmentId: number | null = null; 
  appointmentForm = new FormGroup({
    number: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),
  });

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.authService.getCompanyById(this.companyId).subscribe(
      (companyData: any) => {
        this.company = companyData;
        this.authService.getAppointmentsByCompanyId(this.company.id).subscribe(
          (appointmentData: Appointment[]) => {
            this.appointmentList = appointmentData;
            console.log('Appointment List:', this.appointmentList);
          },
          (appointmentError: any) => {
            console.error('Error fetching appointment list:', appointmentError);
          }
        );
      },
      (companyError: any) => {
        console.error('Error fetching company details:', companyError);
      }
    );
  }

  reserveAppointment(id: number | undefined): void {
    if (id !== undefined) {
      this.userId = 1; 
      const reservation: Reservation = {
        userId: this.userId as number,
        equipmentCount: Number(this.appointmentForm.value.number),
        isCollected: false,
        companyId: this.userId as number,
        appointmentTime: '',
        equipmentId: 0,
        deadline: ''
      }
      console.log('RES.', reservation);
      this.authService.reserveAppointment(id, reservation).subscribe(
        () => {
          console.log('Appointment reserved.');
          // After a successful reservation, refresh the appointment list
          this.loadAppointments();
        },
        (error: any) => {
          console.error('Error reserving appointment:', error);
        }
      );
    } else {
      console.error('Invalid appointment ID');
    }
  }  

  toggleForm(appointmentId: number) {
    this.showForm = !this.showForm;
    this.selectedAppointmentId = appointmentId;
  }
}

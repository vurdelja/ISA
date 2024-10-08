import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../modules/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseServerUrl = "https://localhost:44374/api/";

  constructor(private http: HttpClient) {}
  
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseServerUrl}Appointment/GetAllAppointments`);
  }

  getAppointmentsByStatus(statuses: number[]): Observable<Appointment[]> {
    const statusQuery = statuses.join(',');
    return this.http.get<Appointment[]>(`${this.baseServerUrl}?status=${statusQuery}`);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.baseServerUrl}/${appointmentId}`);
  }
}

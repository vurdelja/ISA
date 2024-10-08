import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../modules/person.model';
import { BehaviorSubject, Observable, map, switchMap, throwError } from 'rxjs';
import { JwtHelperService} from '@auth0/angular-jwt';
import { Company } from '../modules/company.model';
import { Equipment } from '../modules/equipment.model';
import { Appointment } from '../modules/appointment.model';
import { Reservation } from '../modules/reservation.model';

import { CompanyRate1 } from '../modules/companyrate.model';
import { formatDate } from '@angular/common';

import { Login } from '../modules/login.model';
import { User, UserRole } from '../modules/user.model';
import { PickupReservation } from '../modules/pickupreservation.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  baseServerUrl = "https://localhost:44374/api/";
  jwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {
    // Load user from localStorage if available
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUser.next(JSON.parse(userJson));
    }
  }

  // Register user
  registerUser(person: Array<String>) {
    return this.http.post(this.baseServerUrl + "Person/CreatePerson", {
      Email: person[0],
      Password: person[1],
      Name: person[2],
      Surname: person[3],
      City: person[4],
      Country: person[5],
      Phone: person[6],
      Profession: person[7],
      CompanyInfo: person[8]
    }, {
      responseType: 'text',
    });
  }

  // Login user
  login(login: Login): Observable<any> {
    return this.http.post<any>(`${this.baseServerUrl}Auth/login`, login).pipe(
      switchMap(response => {
        const token = response.token;
        const decodedToken = this.jwtHelperService.decodeToken(token);
        const userId = decodedToken.Id;
        return this.getUserById(userId).pipe(
          map(user => {
            localStorage.setItem('jwt', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser.next(user);
            return response;
          })
        );
      })
    );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    this.currentUser.next(null);
  }

  getUncollectedReservations(): Observable<PickupReservation[]> {
    return this.http.get<PickupReservation[]>(`${this.baseServerUrl}Pickup/GetUncollectedReservationsByUser`);
  }

  cancelPickupReservation(reservationId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseServerUrl}Pickup/CancelReservation/${reservationId}`, {});
  }

  getAdminById(idp: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseServerUrl}Person/GetAdminById/`+idp);
  }
  updateAdmin(updatedPerson: Person) {
    return this.http.patch<Person>(`${this.baseServerUrl}Person/UpdateAdmin`, updatedPerson);
  }

  getRegisteredUserById(idp: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseServerUrl}Person/GetRegisteredUserById/`+idp);
  }
  updateRegisteredUser(updatedPerson: Person) {
    return this.http.patch<Person>(`${this.baseServerUrl}Person/UpdateRegisteredUser/`, updatedPerson);
  }

  getUserById(idp: number): Observable<User> {
    console.log('Fetching user with ID: '+idp); // Log the ID being fetched
    return this.http.get<User>(`${this.baseServerUrl}User/GetUserById/`+idp);
  }

  getPersonByUserId(userId: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseServerUrl}User/GetPersonByUserId/${userId}`);
  }
  

  loginUser(loginInfo: Array<string>)
  {
    return this.http.post(this.baseServerUrl + 'User/LoginUser', {
      Email: loginInfo[0],
      Password: loginInfo[1]
    }, {
      responseType: 'text',
    });
  }


  // Update the API method to include userId in fetching rates
  getCompanyRating(companyId: number, userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseServerUrl}CompanyRate/GetCompanyRateById/${companyId}/${userId}`);
  }

  

  rateCompany(companyRate: CompanyRate1, selectedCompanyId: number, userId: number): Observable<any> {
    return this.http.post(
      `${this.baseServerUrl}CompanyRate/RateCompany/${selectedCompanyId}/${userId}`,
      companyRate,
      { responseType: 'text' }
    );
  }

  getAllCompanies(): Observable<Company[]> {
    console.log('ucitane');
    return this.http.get<Company[]>(`${this.baseServerUrl}Company/GetAllCompanies`);

  }

  getAllReservations(): Observable<Reservation[]> {
    console.log('ucitane');
    return this.http.get<Reservation[]>(`${this.baseServerUrl}Reservation/GetAllReservations`);

  }
  getCompanyById(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseServerUrl}Company/GetCompanyById/${companyId}`);
  }
  getEquipmentByCompanyId(companyId: number): Observable<Equipment[]> {
    console.log('Requesting equipment for companyId:', companyId);
    return this.http.get<Equipment[]>(`${this.baseServerUrl}Equipment/GetCompanyEquipmentById/${companyId}`);
  }
  getAppointmentsByCompanyId(companyId: number): Observable<Appointment[]> {
    console.log('Requesting appointments for companyId:', companyId);
    return this.http.get<Appointment[]>(`${this.baseServerUrl}Appointment/GetAppointmentsByCompanyId/${companyId}`);
  }

  getExtraordinaryAppointments(companyId: number, date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseServerUrl}Appointment/GetExtraordinaryAppointments/${companyId}?date=${date}`);
  }


  createPickupReservation(reservation: any): Observable<any> {
    return this.http.post<any>(`${this.baseServerUrl}Appointment/pickup-reservations`, reservation);
  }
  


  GetAppointmentsByDateAndWorking(companyId: number, date: Date): Observable<Appointment[]> {
    // Format the date to a string that your server understands
    const formattedDate = formatDate(date, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
  
    console.log('Requesting appointments for companyId:', companyId, formattedDate);
    
    // Adjust the endpoint to accept the formatted date
    return this.http.get<Appointment[]>(`${this.baseServerUrl}Appointment/GetAppointmentsByDateAndWorking/${companyId}/${formattedDate}`);
  }


  updateCompany(companyId : number,updatedCompany: Company){
    console.log('novanovanova', updatedCompany);
    return this.http.patch<Company>(`${this.baseServerUrl}Company/UpdateCompany/${companyId}`, updatedCompany);  
  }


  addAppointment(newAppointment: Appointment){
    console.log('novanovanova', newAppointment);
    return this.http.post<Appointment>(`${this.baseServerUrl}Appointment/AddAppointment`, newAppointment);
  }
  
  reserveAppointment(id: number | undefined, reservation: Reservation): Observable<Appointment> {
    if (id !== undefined) { 
      return this.http.patch<Appointment>(`${this.baseServerUrl}Appointment/ReserveAppointment/${id}`, reservation);
    } else {
      console.error('Invalid appointment ID');
      return throwError('Invalid appointment ID');
    }
  }
  
  editEquipment(equipmentId: number | undefined, newEquipment: Equipment): Observable<Equipment[]> {
    console.log('Editing eq with id:', equipmentId);
    return this.http.patch<Equipment[]>(`${this.baseServerUrl}Equipment/EditEquipment/${equipmentId}`, newEquipment);
  }

  addEquipment(newEquipment: Equipment): Observable<Equipment[]> {
    console.log('Adding eq with id:', newEquipment);
    return this.http.post<Equipment[]>(`${this.baseServerUrl}Equipment/AddEquipment`, newEquipment);
  }

  deleteEquipment(equipmentId: number | undefined): Observable<Equipment[]> {
    console.log('Deleting eq with id:', equipmentId);
    return this.http.delete<Equipment[]>(`${this.baseServerUrl}Equipment/DeleteEquipment/${equipmentId}`);
  }
  GetAllSysAdmin(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseServerUrl}User/GetAllSysAdmin`);
  }
  CreateSystemAdmin(user: User): Observable<User[]> {
    // Koristite HTTP POST metodu i prosledite podatke o korisniku
    return this.http.post<User[]>(`${this.baseServerUrl}User/CreateSystemAdmin`, user);
  }
  getAppointmentsForDay(date: Date): Observable<any[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<any[]>(`${this.baseServerUrl}Appointment/GetAppointmentsForDay?date=${formattedDate}`);
  }



  getOtherAdmins(id: number, companyId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseServerUrl}User/GetAllOtherCompanyAdmins/${id}/${companyId}`);
  }

  hasReservation(userId: number, companyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseServerUrl}Reservation/HasReservation/${userId}/${companyId}`);
  }

  createReservation(reservation: Reservation): Observable<any> {
    const reservationId = reservation.id || 0;
    return this.http.patch(`${this.baseServerUrl}Reservation/reservation/MakeReservation/${reservationId}`, reservation);
  }
  getAllUncollectedReservations(companyId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseServerUrl}Reservation/GetAllUncollectedReservations/${companyId}`);
  }
  didReservationExpire(reservationId: number | undefined): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseServerUrl}Reservation/DidReservationExpire/${reservationId}`);
  }
  reservationCollected(reservationId: number | undefined): Observable<boolean> {
    if (reservationId !== undefined) {
      return this.http.patch<boolean>(
        `${this.baseServerUrl}Reservation/ReservationCollected/${reservationId}`,
        {} // Provide an empty object as the body parameter
      );
    } else {
      // Handle the case where reservationId is undefined, such as returning an Observable with an error
      return throwError('Reservation ID is undefined');
    }
  }
  

  getReservationDataById(id: number): Observable<any> {
    // Napravite HTTP GET zahtev ka backendu sa ID-om dobijenim iz QR koda
    return this.http.get<any>(`${this.baseServerUrl}Reservation/${id}`);
  }
  sendCoordinates(equipmentId: number): Observable<any> {
    const url = `${this.baseServerUrl}EquipmentTracking/sendCoordinates?equipmentId=${equipmentId}`;
    return this.http.post<any>(url, null);
  }

  getCompanyByAdminId(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseServerUrl}Company/GetCompanyByAdminId/${id}`);
  }

  getUsersWhoReserved(companyId: number | undefined): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseServerUrl}User/GetUsersWhoReserved/${companyId}`);

  }

}


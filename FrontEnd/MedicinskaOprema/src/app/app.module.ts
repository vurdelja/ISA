import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthService } from './services/auth.service';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AdminProfileEditingComponent } from './components/admin-profile-editing/admin-profile-editing.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { CompanyProfileEditingComponent } from './components/company-profile-editing/company-profile-editing.component';
import {CompanyRegistrationComponent} from './components/company-registration/company-registration.component';
import {SearchFilterEquipmentComponent} from './components/search-filter-equipment/search-filter-equipment.component';
import { UserProfileEditingComponent } from './components/user-profile-editing/user-profile-editing.component';
import { SearchFilterCompaniesComponent } from './components/search-filter-companies/search-filter-companies.component';
import { CompanyRatingComponent } from './components/company-rating/company-rating.component';
import { ReserveAppointmentsComponent } from './components/reserve-appointments/reserve-appointments.component';
import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';

import { DatePipe } from '@angular/common'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import { UserManagementComponent } from './user-management/user-management.component';
import { CalendarComponent } from './calendar/calendar.component';

import { EquipmentCollectingComponent } from './admins-home-page/equipment-collecting/equipment-collecting.component';

import { QrComponent } from './qr/qr.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleComponent } from './vehicle/vehicle.component';
import { UsersReservedComponent } from './admins-home-page/users-reserved/users-reserved.component';

import { UserHomePageComponent } from './components/user-home-page/user-home-page.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { PickupComponent } from './pickup/pickup.component';
@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    HomePageComponent,
    AdminProfileEditingComponent,
    NavbarComponent,
    LogInComponent,
    CompanyProfileComponent,
    CompanyProfileEditingComponent,
    CompanyRegistrationComponent,
    SearchFilterEquipmentComponent,
    UserProfileEditingComponent,
    SearchFilterCompaniesComponent,
    CompanyRatingComponent,
    ReserveAppointmentsComponent,
    EquipmentListComponent,
    UserManagementComponent,
    CalendarComponent,

    EquipmentCollectingComponent,
    QrComponent,
    ReservationsComponent,
    VehicleComponent,
    UsersReservedComponent,
   

    CalendarComponent,
    UserHomePageComponent,
    AppointmentsComponent,
    PickupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    HttpClientModule,
    FullCalendarModule,
    BrowserAnimationsModule,
   
   
  ],
  providers: [
    AuthService,
    DatePipe,
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

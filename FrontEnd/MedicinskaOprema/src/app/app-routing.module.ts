import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AdminProfileEditingComponent } from './components/admin-profile-editing/admin-profile-editing.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { CompanyProfileEditingComponent } from './components/company-profile-editing/company-profile-editing.component';
import { CompanyRegistrationComponent } from './components/company-registration/company-registration.component';
import { SearchFilterEquipmentComponent } from './components/search-filter-equipment/search-filter-equipment.component';
import { UserProfileEditingComponent } from './components/user-profile-editing/user-profile-editing.component';

import { SearchFilterCompaniesComponent } from './components/search-filter-companies/search-filter-companies.component';
import { CompanyRatingComponent } from './components/company-rating/company-rating.component';
import { ReserveAppointmentsComponent } from './components/reserve-appointments/reserve-appointments.component';
import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CalendarComponent } from './calendar/calendar.component';
import { UserHomePageComponent } from './components/user-home-page/user-home-page.component';

import { EquipmentCollectingComponent } from './admins-home-page/equipment-collecting/equipment-collecting.component';
import { PickupComponent } from './pickup/pickup.component';
import { QrComponent } from './qr/qr.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { UsersReservedComponent } from './admins-home-page/users-reserved/users-reserved.component';

import { VehicleComponent } from './vehicle/vehicle.component';


const routes: Routes = [
  { path: '', component: LogInComponent }, 
  { path: 'home-page', component: HomePageComponent }, 
  { path: 'user-home-page', component: UserHomePageComponent },

  { path: 'app-registration', component: RegistrationComponent }, 
  { path: 'admin-profile-editing/:userId', component: AdminProfileEditingComponent }, 
  { path: 'users-reserved/:id/:userId', component: UsersReservedComponent }, 


 { path: 'company-registration', component: CompanyRegistrationComponent },
 { path: 'search-filter-equipment', component: SearchFilterEquipmentComponent },
  { path: 'user-profile-editing', component: UserProfileEditingComponent }, 
  { path: 'user-profile-editing/:id', component: UserProfileEditingComponent },

  { path: 'search-filter-companies', component: SearchFilterCompaniesComponent }, 
  { path: 'search-filter-equipment', component: SearchFilterEquipmentComponent },


  { path: 'company-profile/:id/:userId/company-profile-editing', component: CompanyProfileEditingComponent }, 
  { path: 'company-profile/:id/:userId/reserve-appointments/:id', component: ReserveAppointmentsComponent }, 
  { path: 'company-profile/:id/:userId/company-profile-editing/equipment-list', component: EquipmentListComponent },
  { path: 'company-rating/:id', component: CompanyRatingComponent },
  { path: 'app-user-management', component: UserManagementComponent }, 
  { path: 'app-calendar', component: CalendarComponent }, 

  { path: 'pickup/:companyId', component: PickupComponent }, // Add this route

 
  { path: 'equipment-collecting/:id', component: EquipmentCollectingComponent }, 

  { path: 'qr-container', component: QrComponent },
  { path :'reservations', component:ReservationsComponent},
{path:'map',component:VehicleComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

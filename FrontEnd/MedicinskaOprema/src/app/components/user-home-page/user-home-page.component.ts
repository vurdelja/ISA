import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User, UserRole } from 'src/app/modules/user.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/modules/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Equipment } from 'src/app/modules/equipment.model';
import { EquipmentService } from 'src/app/services/equipment.service';
import { Company1 } from 'src/app/modules/company.model';
import { Reservation } from 'src/app/modules/reservation.model';
import { Appointment } from 'src/app/modules/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PickupReservation } from 'src/app/modules/pickupreservation.model';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.css']
})
export class UserHomePageComponent implements OnInit {
  companies: Company[] = [];
  reservations: Reservation[] = [];
  user: any;
  currentUser: User | undefined;
  UserRole = UserRole;
  searchForm: FormGroup;
  companyList: Company[] = [];
  appointments: Appointment[] = [];
  uncollectedReservations: PickupReservation[] = [];


  
  filteredCompaniesList: Company[] = [];
  companyList1: Company1[] = [];

 
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private equipmentService: EquipmentService,
    private fb: FormBuilder,
    private appointmentService: AppointmentService // Inject the service here


  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterRating: [''],  // Dropdown for rating
      filterAddress: ['']     // Dropdown for address
    });
  }
  
  @ViewChild('orderEquipmentInput', { static: true }) orderEquipmentInput!: ElementRef;

  ngOnInit(): void {
    this.authService.getAllCompanies().subscribe({
      next: (result: any) => {
        this.companies = result;
        console.log('Data loaded successfully:', this.companies);
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });

    this.authService.getAllReservations().subscribe({
      next: (result: any) => {
        this.reservations = result;
        console.log('Data loaded successfully:', this.reservations);
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });

    this.appointmentService.getAllAppointments().subscribe({
      next: (result: any) => {
        this.appointments = result;
        console.log('Data loaded successfully:', this.appointments);
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });

    this.loadCompaniesData();
    this.loadReservationsData();
    this.loadAppointments();
    this.loadUncollectedReservations();

    
    
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

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments: Appointment[]) => {
        this.appointments = appointments;
      },
      error: (error) => console.error('API error:', error)
    });
  }

  loadUncollectedReservations(): void {
    console.log('Attempting to load uncollected reservations');
    
    this.authService.getUncollectedReservations().subscribe({
      next: (reservations) => {
        console.log('Uncollected reservations loaded successfully', reservations);
        this.uncollectedReservations = reservations;
      },
      error: (error) => {
        console.error('API error while loading uncollected reservations:', error);
      }
    });
  }
  
  cancelPickupReservation(reservationId: number): void {
 
    this.authService.cancelPickupReservation(reservationId).subscribe({
      next: () => {
        this.uncollectedReservations = this.uncollectedReservations.filter(r => r.id !== reservationId);
        console.log('Reservation cancelled successfully');
      },
      error: (error) => console.error('API error:', error)
    });
  }

  canCancel(startTime: string): boolean {
    const currentTime = new Date();
    const startDateTime = new Date(startTime);  // Convert string to Date object here
    const diffHours = (startDateTime.getTime() - currentTime.getTime()) / (1000 * 3600);
    return diffHours > 24;
  }
  

  cancelAppointment(appointmentId: number): void {
    if (appointmentId === undefined) {
      console.error('Attempted to cancel an appointment without an ID');
      return;
    }
    // Implement cancellation logic
    console.log(`Cancelling appointment with ID: ${appointmentId}`);
    // Call to service to cancel the appointment
  }

  ratings: number[] = [1, 2, 3, 4, 5];
  addresses: string[] = [];

  loadCompaniesData(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (companies: Company[]) => {
        this.companyList = companies;
        this.filteredCompaniesList = [...this.companyList];

        // Extract unique addresses from companies
        this.addresses = [...new Set(companies.map(company => company.address))];
      },
      error: (error) => console.error('API error:', error)
    });
  }

  loadReservationsData(): void {
    this.authService.getAllReservations().subscribe({
      next: (reservations: Reservation[]) => {
        this.reservations = reservations;
      },
      error: (error) => console.error('API error:', error)
    });
  }


  filterCompanies(): void {
    const { searchTerm, filterRating, filterAddress } = this.searchForm.value;
    console.log("Filtering with values:", { searchTerm, filterRating, filterAddress });
    
    this.filteredCompaniesList = this.companyList.filter(company => {
      const matchesSearchTerm = !searchTerm || company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAddress = !filterAddress || company.address.toLowerCase() === filterAddress.toLowerCase();

      let matchesRating = true;
      if (filterRating) {
        const [minRating, maxRating] = filterRating.split('-').map(Number);
        const companyRating = company.averageRating;
        if (maxRating) {
          matchesRating = companyRating >= minRating && companyRating <= maxRating;
        } else {
          matchesRating = companyRating === minRating;
        }
      }

      return matchesSearchTerm && matchesRating && matchesAddress;
    });

    console.log("Filtered companies:", this.filteredCompaniesList);
  }

  navigateToCompanyRegistration(): void {
    this.router.navigate(['/company-registration']);
  }

  navigateToSearchCompanies(): void {
    this.router.navigate(['/search-filter-companies']);
  }

  navigateToCompanyRating(): void {
    this.router.navigate(['/company-rating']);
  }

  private jwt_decode(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    return decoded;
  }

  showCompanyDetails(equipmentId: number | undefined): void {
    if (equipmentId !== undefined)
      this.equipmentService.GetCompanybyEquipmentId(equipmentId).subscribe(
        (companyData: Company1[]) => {
          this.companyList1 = companyData;
          console.log('Company Details:', this.companyList1);
        },
        (companyError: any) => {
          console.error('Error fetching company details:', companyError);
        }
      );
  }

  openTab(evt: Event, tabName: string) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
      const tabContent = tabContents.item(i);
      if (tabContent instanceof HTMLElement) {
        tabContent.style.display = "none";
      }
    }

    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
      const tabButton = tabButtons.item(i);
      if (tabButton instanceof HTMLElement) {
        tabButton.classList.remove("active");
      }
    }

    const targetTabContent = document.getElementById(tabName);
    if (targetTabContent instanceof HTMLElement) {
      targetTabContent.style.display = "block";
    }

    const target = evt.target as HTMLElement;
    if (target) {
      target.classList.add("active");
    }
  }

  navigateToPickup(companyId: number): void {
    this.router.navigate(['/pickup', companyId]);
  }
}

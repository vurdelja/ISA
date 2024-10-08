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

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent {
  companies: Company[] = [];
  user: any;
  currentUser: User | undefined;
  UserRole = UserRole;
  searchForm: FormGroup;
  companyList: Company[] = [];
  filteredCompaniesList: Company[] = [];
  equipmentList: Equipment[] = [];
  filteredEquipmentList: Equipment[] = [];
  companyList1: Company1[] = [];
  adminsCompany:Company | undefined;
 

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private equipmentService: EquipmentService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterRating: [''],
      filterType: [''],
      orderEquipmentName: [''],
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
        // Handle error as needed
      }
      

    });
    this.loadCompaniesData();
    this.loadEquipmentData();
    const token = localStorage.getItem("jwt");

    if (token) {
      // Decode the token to get user information
      this.user = this.jwt_decode(token);
      // Now 'this.user' contains the user information
      console.log("User information:", this.user.Id);
    } else {
      console.error("Token not found in localStorage");
    }
    this.authService.getUserById(Number(this.user.Id)).subscribe({
      next: (result: any) => {  
          this.currentUser = result;
          console.log('Data user:', this.currentUser);
      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
    });
    //-------------------------------------------------------ADMIN----------------------------------------------------------------
    //adminova kompanija
    this.authService.getCompanyByAdminId(Number(this.user.Id)).subscribe({
      next: (result: any) => {  
          this.adminsCompany = result;
          console.log('admins company:', this.adminsCompany);

      },
      error: (error) => {
        console.error('API error:', error);
        // Handle error as needed
      }
    });
    
  }


  loadCompaniesData(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (result: Company[]) => {
        this.companyList = result;
        this.filteredCompaniesList = [...this.companyList];
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });
  }

  filterCompanies(): void {
    const { searchTerm, filterRating, filterType } = this.searchForm.value;
  
    this.filteredCompaniesList = this.companyList.filter(company => {
      const companyRating = company.averageRating;
  
      return (
        (searchTerm ?
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.address.toLowerCase().includes(searchTerm.toLowerCase())
          : true
        ) &&
        (filterRating ?
          (filterRating === '5' && companyRating === 5) ||
          (filterRating === '4-5' && companyRating >= 4 && companyRating <= 5) ||
          (filterRating === '3-4' && companyRating >= 3 && companyRating < 4)
          // Add more conditions based on your rating ranges
          : true
        ) &&
        (filterType ?
          (filterType === '5' && companyRating === 5) ||
          (filterType === '4-5' && companyRating >= 4 && companyRating <= 5) ||
          (filterType === '3-4' && companyRating >= 3 && companyRating < 4) ||
          (filterType === '<3' && companyRating < 3)
          // Add more conditions based on your rating ranges for filterType
          : true
        )
      );
    });
  }
  // Metoda za navigaciju ka formi za registraciju kompanije
  navigateToCompanyRegistration(): void {
    this.router.navigate(['/company-registration']);
  }



  navigateToSearhFilterEquipment(): void{
    this.router.navigate(['/search-filter-equipment']);
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
  

  loadEquipmentData(): void {
    this.equipmentService.getAllEquipments().subscribe({
      next: (result: Equipment[]) => {
        this.equipmentList = result;
        this.filteredEquipmentList = [...this.equipmentList];
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });
  }

  filterEquipment(): void {
    const { searchTerm, filterRating, filterType } = this.searchForm.value;

    this.filteredEquipmentList = this.equipmentList.filter(equipment =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRating ? equipment.rating === parseInt(filterRating, 10) : true) &&
      (filterType ? equipment.type.toLowerCase() === filterType.toLowerCase() : true)
      // Dodajte dodatne uslove filtriranja prema potrebi
    );
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
    // Sakrij sve tabove
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
      const tabContent = tabContents.item(i);
      if (tabContent instanceof HTMLElement) {
        tabContent.style.display = "none";
      }
    }
  
    // Ukloni klasu "active" sa svih dugmadi tabova
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
      const tabButton = tabButtons.item(i);
      if (tabButton instanceof HTMLElement) {
        tabButton.classList.remove("active");
      }
    }
  
    // Prikazi ciljni tab
    const targetTabContent = document.getElementById(tabName);
    if (targetTabContent instanceof HTMLElement) {
      targetTabContent.style.display = "block";
    }
  
    // Dodaj klasu "active" na kliknuto dugme
    const target = evt.target as HTMLElement;
    if (target) {
      target.classList.add("active");
    }
  }
  
}

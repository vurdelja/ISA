import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/modules/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-companies-list',
  templateUrl: './search-filter-companies.component.html',
  styleUrls: ['./search-filter-companies.component.css']
})

export class SearchFilterCompaniesComponent implements OnInit {
  searchForm: FormGroup;
  companyList: Company[] = [];
  filteredCompaniesList: Company[] = [];

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterRating: [''],
      filterType: [''],
    });
  }


  ngOnInit(): void {
    this.loadCompaniesData();
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
  

  

}

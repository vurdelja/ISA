import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company1 } from 'src/app/modules/company.model';
import { Equipment } from 'src/app/modules/equipment.model';
import { EquipmentService } from 'src/app/services/equipment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-equipment-list',
  templateUrl: './search-filter-equipment.component.html',
  styleUrls: ['./search-filter-equipment.component.css']
})
export class SearchFilterEquipmentComponent implements OnInit {
  searchForm: FormGroup;
  equipmentList: Equipment[] = [];
  filteredEquipmentList: Equipment[] = [];
  companyList: Company1[] = [];

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterRating: [''],
      filterType: [''],
      orderEquipmentName: [''], // Dodajte Reactive Forms kontrolu za naručivanje
    });
  }

  @ViewChild('orderEquipmentInput', { static: true }) orderEquipmentInput!: ElementRef;

 
  ngOnInit(): void {
    this.loadEquipmentData();
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
        this.companyList = companyData;
        console.log('Company Details:', this.companyList);
      },
      (companyError: any) => {
        console.error('Error fetching company details:', companyError);
      }
    );
  }
}

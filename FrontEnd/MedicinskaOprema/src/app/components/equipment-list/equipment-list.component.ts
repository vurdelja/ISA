import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Equipment } from 'src/app/modules/equipment.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css']
})
export class EquipmentListComponent {
  companyId: number = 0;
  company: any;
  equipmentList: Equipment[] = [];
  showAddEquipmentForm: boolean = false;
  editMode: boolean = false; // Flag to indicate edit mode
  editedEquipmentId: number | undefined;

  addEquipmentForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    type: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    description: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    count: new FormControl('', Validators.required),
  });

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  setFormValues(equipment: Equipment) {
    this.addEquipmentForm.patchValue({
      name: equipment.name,
      type: equipment.type,
      description: equipment.description,
      count: equipment.count.toString(), 
    });
  }

  ngOnInit(): void {
    
    // Use 'id' instead of 'companyid'
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
  
    this.authService.getCompanyById(this.companyId).subscribe(
      (companyData: any) => {
        this.company = companyData;
  
        // Now that companyData is available, call getEquipmentByCompanyId
        this.authService.getEquipmentByCompanyId(this.company.id).subscribe(
          (equipmentData: Equipment[]) => {
            this.equipmentList = equipmentData;
  
            console.log('Company Details:', this.company);
            console.log('Equipment List:', this.equipmentList);
          },
          (equipmentError: any) => {
            console.error('Error fetching equipment list:', equipmentError);
          }
        );
      },
      (companyError: any) => {
        console.error('Error fetching company details:', companyError);
      }
    );
  }

  editEquipment(equipment: Equipment): void {
    this.setFormValues(equipment);
    this.showAddEquipmentForm = true;
    this.editMode = true;
    this.editedEquipmentId = equipment.id;
  }

  toggleAddEquipmentForm(): void {
    this.showAddEquipmentForm = !this.showAddEquipmentForm;
    this.editMode = false; // Reset edit mode when toggling the form
    this.editedEquipmentId = undefined; // Reset edited equipment ID
  }

  addEquipment(): void {
    const newEquipment: Equipment = {
      name: this.addEquipmentForm.value.name || '',
      type: this.addEquipmentForm.value.type || '',
      description: this.addEquipmentForm.value.description || '',
      rating: 0,
      count: Number(this.addEquipmentForm.value.count),
      companyId: this.companyId
    };

    if (this.editMode) {
      // If in edit mode, call the editEquipment method instead
      this.editEquipmentById(this.editedEquipmentId || 0, newEquipment);
    } else {
      // Otherwise, call the addEquipment method
      this.addNewEquipment(newEquipment);
    }
  }

  addNewEquipment(newEquipment: Equipment): void {
    this.authService.addEquipment(newEquipment).subscribe(
      (equipmentData: any) => {
        // Add the new equipment to the equipmentList
        this.equipmentList.push(equipmentData);
        this.showAddEquipmentForm = false;
        this.refreshEquipmentList(); // Refresh the equipment list
      },
      (error: any) => {
        console.error('Error adding new equipment:', error);
      }
    );
  }

  editEquipmentById(id: number, newEquipment: Equipment): void {
    this.authService.editEquipment(id, newEquipment).subscribe(
      (equipmentData: any) => {
        // Find the index of the edited equipment in the equipmentList
        const index = this.equipmentList.findIndex(e => e.id === id);
        // Replace the old equipment with the updated one
        if (index !== -1) {
          this.equipmentList[index] = equipmentData;
        }
        this.showAddEquipmentForm = false;
        this.editMode = false;
        this.editedEquipmentId = undefined;
        this.refreshEquipmentList(); // Refresh the equipment list
      },
      (error: any) => {
        console.error('Error editing equipment:', error);
      }
    );
  }

  deleteEquipment(equipmentId: number | undefined): void {
    this.authService.deleteEquipment(equipmentId).subscribe(
      (equipmentData: any) => {
        // Remove the deleted equipment from the equipmentList
        this.equipmentList = this.equipmentList.filter(e => e.id !== equipmentId);
        this.refreshEquipmentList(); // Refresh the equipment list
      },
      (error: any) => {
        console.error('Error deleting equipment:', error);
      }
    );
  }

  // Helper method to refresh the equipment list
  private refreshEquipmentList(): void {
    this.authService.getEquipmentByCompanyId(this.company.id).subscribe(
      (equipmentData: Equipment[]) => {
        this.equipmentList = equipmentData;
        console.log('Updated Equipment List:', this.equipmentList);
      },
      (equipmentError: any) => {
        console.error('Error fetching updated equipment list:', equipmentError);
      }
    );
  }
}

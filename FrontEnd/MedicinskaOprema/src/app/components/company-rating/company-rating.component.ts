import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/modules/company.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyRate, CompanyRate1 } from 'src/app/modules/companyrate.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-company-rating',
  templateUrl: './company-rating.component.html',
  styleUrls: ['./company-rating.component.css']
})
export class CompanyRatingComponent implements OnInit {
  companyId?: number;
  rateForm = new FormGroup({
    rate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')]),
    highQuality: new FormControl(false),
    lowQuality: new FormControl(false),
    cheap: new FormControl(false),
    expensive: new FormControl(false),
    wideSelection: new FormControl(false),
    limitedSelection: new FormControl(false),
    description: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    });
  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.companyId = +id;
        this.loadExistingRating();
      } else {
        console.error("No company ID available in route parameters.");
      }
    });
  }
    
  loadExistingRating() {
    const userId = this.getUserID(); // Fetch userID from AuthService
    if (this.companyId && userId !== null) {
      console.log("Loading existing rating for company ID:", this.companyId, "and User ID:", userId);
      this.authService.getCompanyRating(this.companyId, userId).subscribe(
        data => {
          if (data && data.length > 0) {
            this.rateForm.patchValue(data[0]);
            console.log("Form updated with existing data.");
          } else {
            console.log("No existing data found.");
          }
        },
        error => {
          console.error('Failed to load existing rating:', error);
        }
      );
    } else {
      console.error("Company ID or User ID is not set. Cannot load existing rating.");
    }
  }


  // In AuthService or your Angular component
getUserID(): number | null {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    const user = JSON.parse(userJson);
    return user.userID;
  }
  return null; // Return null if there is no user data
}



      
  registerSubmitted() {
    const userId = this.getUserID();  // Get the userID from AuthService
    if (this.rateForm.valid && this.companyId && userId !== null) {
      const formData = this.rateForm.value;
      const companyData: CompanyRate1 = {
            companyId: this.companyId,
            userId: userId,  // Include the userId in the data
            rate: formData.rate != null ? +formData.rate : 0,
            highQuality: formData.highQuality || false,
            lowQuality: formData.lowQuality || false,
            cheap: formData.cheap || false,
            expensive: formData.expensive || false,
            wideSelection: formData.wideSelection || false,
            limitedSelection: formData.limitedSelection || false,
            description: formData.description || '',
          };
          console.log("Submitting company data:", companyData);
          this.authService.rateCompany(companyData, this.companyId, userId).subscribe(
        res => {
          console.log("Successfully submitted rating:", res);
        },
        error => {
          console.error("Failed to submit rating:", error);
        }
      );
    } else {
      console.error('Form is invalid, companyId is undefined, or user is not authenticated:', this.rateForm.errors);
    }
  }
}
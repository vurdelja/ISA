import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegistrationComponent } from './company-registration.component';

describe('AdminProfileEditingComponent', () => {
  let component: CompanyRegistrationComponent;
  let fixture: ComponentFixture<CompanyRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyRegistrationComponent]
    });
    fixture = TestBed.createComponent(CompanyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileEditingComponent } from './company-profile-editing.component';

describe('CompanyProfileEditingComponent', () => {
  let component: CompanyProfileEditingComponent;
  let fixture: ComponentFixture<CompanyProfileEditingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyProfileEditingComponent]
    });
    fixture = TestBed.createComponent(CompanyProfileEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRatingComponent } from './company-rating.component';

describe('CompanyRatingComponent', () => {
  let component: CompanyRatingComponent;
  let fixture: ComponentFixture<CompanyRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyRatingComponent]
    });
    fixture = TestBed.createComponent(CompanyRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterCompaniesComponent } from './search-filter-companies.component';

describe('SearchFilterCompaniesComponent', () => {
  let component: SearchFilterCompaniesComponent;
  let fixture: ComponentFixture<SearchFilterCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFilterCompaniesComponent]
    });
    fixture = TestBed.createComponent(SearchFilterCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

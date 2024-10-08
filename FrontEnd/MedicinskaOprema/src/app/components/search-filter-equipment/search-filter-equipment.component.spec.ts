import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterEquipmentComponent } from './search-filter-equipment.component';

describe('SearchFilterEquipmentComponent', () => {
  let component: SearchFilterEquipmentComponent;
  let fixture: ComponentFixture<SearchFilterEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFilterEquipmentComponent]
    });
    fixture = TestBed.createComponent(SearchFilterEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

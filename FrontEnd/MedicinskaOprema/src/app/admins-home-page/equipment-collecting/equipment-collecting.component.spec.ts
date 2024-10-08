import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentCollectingComponent } from './equipment-collecting.component';

describe('EquipmentCollectingComponent', () => {
  let component: EquipmentCollectingComponent;
  let fixture: ComponentFixture<EquipmentCollectingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmentCollectingComponent]
    });
    fixture = TestBed.createComponent(EquipmentCollectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

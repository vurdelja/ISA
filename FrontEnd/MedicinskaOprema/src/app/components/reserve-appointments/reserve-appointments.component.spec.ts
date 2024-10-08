import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveAppointmentsComponent } from './reserve-appointments.component';

describe('ReserveAppointmentsComponent', () => {
  let component: ReserveAppointmentsComponent;
  let fixture: ComponentFixture<ReserveAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReserveAppointmentsComponent]
    });
    fixture = TestBed.createComponent(ReserveAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

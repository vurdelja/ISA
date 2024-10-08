import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersReservedComponent } from './users-reserved.component';

describe('UsersReservedComponent', () => {
  let component: UsersReservedComponent;
  let fixture: ComponentFixture<UsersReservedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersReservedComponent]
    });
    fixture = TestBed.createComponent(UsersReservedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

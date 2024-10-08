import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileEditingComponent } from './admin-profile-editing.component';

describe('AdminProfileEditingComponent', () => {
  let component: AdminProfileEditingComponent;
  let fixture: ComponentFixture<AdminProfileEditingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProfileEditingComponent]
    });
    fixture = TestBed.createComponent(AdminProfileEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileEditingComponent } from './user-profile-editing.component';

describe('UserProfileEditingComponent', () => {
  let component: UserProfileEditingComponent;
  let fixture: ComponentFixture<UserProfileEditingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileEditingComponent]
    });
    fixture = TestBed.createComponent(UserProfileEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubmitNameComponent } from './admin-submit-name.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('AdminSubmitNameComponent', () => {
  let component: AdminSubmitNameComponent;
  let fixture: ComponentFixture<AdminSubmitNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [AdminSubmitNameComponent]
    });
    fixture = TestBed.createComponent(AdminSubmitNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

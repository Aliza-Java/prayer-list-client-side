import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddNameComponent } from './admin-add-name.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';

describe('AdminAddNameComponent', () => {
  let component: AdminAddNameComponent;
  let fixture: ComponentFixture<AdminAddNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [AdminAddNameComponent, LoadingSpinnerComponent]
    });
    fixture = TestBed.createComponent(AdminAddNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

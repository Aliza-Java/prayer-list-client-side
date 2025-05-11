import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentComponent } from './urgent.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';

describe('UrgentComponent', () => {
  let component: UrgentComponent;
  let fixture: ComponentFixture<UrgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [UrgentComponent, LoadingSpinnerComponent]
    });
    fixture = TestBed.createComponent(UrgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNameComponent } from './add-name.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';

describe('AddNameComponent', () => {
  let component: AddNameComponent;
  let fixture: ComponentFixture<AddNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [AddNameComponent, LoadingSpinnerComponent]
    });
    fixture = TestBed.createComponent(AddNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

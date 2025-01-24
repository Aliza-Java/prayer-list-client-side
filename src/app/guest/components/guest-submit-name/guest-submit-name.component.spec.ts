import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestSubmitNameComponent } from './guest-submit-name.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('GuestSubmitNameComponent', () => {
  let component: GuestSubmitNameComponent;
  let fixture: ComponentFixture<GuestSubmitNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [GuestSubmitNameComponent]
    });
    fixture = TestBed.createComponent(GuestSubmitNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

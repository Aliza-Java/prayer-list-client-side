import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestEmailComponent } from './guest-email.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('GuestEmailComponent', () => {
  let component: GuestEmailComponent;
  let fixture: ComponentFixture<GuestEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [GuestEmailComponent]
    });
    fixture = TestBed.createComponent(GuestEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

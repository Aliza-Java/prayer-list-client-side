import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestHomeComponent } from './guest-home.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GuestEmailComponent } from '../guest-email/guest-email.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('GuestHomeComponent', () => {
  let component: GuestHomeComponent;
  let fixture: ComponentFixture<GuestHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule, AppRoutingModule],
      declarations: [GuestHomeComponent, GuestEmailComponent]
    });
    fixture = TestBed.createComponent(GuestHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

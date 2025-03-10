import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestEditNameComponent } from './guest-edit-name.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

describe('GuestEditNameComponent', () => {
  let component: GuestEditNameComponent;
  let fixture: ComponentFixture<GuestEditNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule, FormsModule, SharedModule],
      declarations: [GuestEditNameComponent]
    });
    fixture = TestBed.createComponent(GuestEditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

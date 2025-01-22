import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditNameComponent } from './admin-edit-name.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('AdminEditNameComponent', () => {
  let component: AdminEditNameComponent;
  let fixture: ComponentFixture<AdminEditNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [AdminEditNameComponent]
    });
    fixture = TestBed.createComponent(AdminEditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

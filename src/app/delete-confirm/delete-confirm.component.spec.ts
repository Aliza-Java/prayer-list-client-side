import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmComponent } from './delete-confirm.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('DeleteConfirmComponent', () => {
  let component: DeleteConfirmComponent;
  let fixture: ComponentFixture<DeleteConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteConfirmComponent, HttpClientModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(DeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

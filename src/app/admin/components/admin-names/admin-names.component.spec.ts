import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNamesComponent } from './admin-names.component';
import { HttpClientModule } from '@angular/common/http';
import { EmptyListComponent } from 'src/app/empty-list/empty-list.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';


describe('AdminNamesComponent', () => {
  let component: AdminNamesComponent;
  let fixture: ComponentFixture<AdminNamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [AdminNamesComponent, EmptyListComponent, LoadingSpinnerComponent]
    });
    fixture = TestBed.createComponent(AdminNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

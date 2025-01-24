import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyComponent } from './weekly.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDavenforsComponent } from 'src/app/select-davenfors/select-davenfors.component';
import { EmptyListComponent } from 'src/app/empty-list/empty-list.component';

describe('WeeklyComponent', () => {
  let component: WeeklyComponent;
  let fixture: ComponentFixture<WeeklyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [WeeklyComponent, SelectDavenforsComponent, EmptyListComponent]
    });
    fixture = TestBed.createComponent(WeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

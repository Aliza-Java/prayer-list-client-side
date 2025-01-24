import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDavenforsComponent } from './select-davenfors.component';
import { HttpClientModule } from '@angular/common/http';
import { EmptyListComponent } from '../empty-list/empty-list.component';

describe('SelectDavenforsComponent', () => {
  let component: SelectDavenforsComponent;
  let fixture: ComponentFixture<SelectDavenforsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [SelectDavenforsComponent, EmptyListComponent]
    });
    fixture = TestBed.createComponent(SelectDavenforsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

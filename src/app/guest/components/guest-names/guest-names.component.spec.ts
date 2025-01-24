import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestNamesComponent } from './guest-names.component';
import { HttpClientModule } from '@angular/common/http';
import { EmptyListComponent } from 'src/app/empty-list/empty-list.component';

describe('GuestNamesComponent', () => {
  let component: GuestNamesComponent;
  let fixture: ComponentFixture<GuestNamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [GuestNamesComponent, EmptyListComponent]
    });
    fixture = TestBed.createComponent(GuestNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

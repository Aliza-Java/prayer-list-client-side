import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailsComponent } from './manage-emails.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EmptyListComponent } from 'src/app/empty-list/empty-list.component';

describe('ManageEmailsComponent', () => {
  let component: ManageEmailsComponent;
  let fixture: ComponentFixture<ManageEmailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [ManageEmailsComponent, EmptyListComponent]
    });
    fixture = TestBed.createComponent(ManageEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

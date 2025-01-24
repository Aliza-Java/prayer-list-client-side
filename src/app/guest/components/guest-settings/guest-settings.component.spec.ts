import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestSettingsComponent } from './guest-settings.component';
import { HttpClientModule } from '@angular/common/http';

describe('GuestSettingsComponent', () => {
  let component: GuestSettingsComponent;
  let fixture: ComponentFixture<GuestSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [GuestSettingsComponent]
    });
    fixture = TestBed.createComponent(GuestSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

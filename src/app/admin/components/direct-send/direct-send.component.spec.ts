import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSendComponent } from './direct-send.component';

describe('DirectSendComponent', () => {
  let component: DirectSendComponent;
  let fixture: ComponentFixture<DirectSendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectSendComponent]
    });
    fixture = TestBed.createComponent(DirectSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

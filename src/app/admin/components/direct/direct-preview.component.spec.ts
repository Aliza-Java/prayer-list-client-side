import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPreviewComponent } from './direct-preview.component';

describe('DirectPreviewComponent', () => {
  let component: DirectPreviewComponent;
  let fixture: ComponentFixture<DirectPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectPreviewComponent]
    });
    fixture = TestBed.createComponent(DirectPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

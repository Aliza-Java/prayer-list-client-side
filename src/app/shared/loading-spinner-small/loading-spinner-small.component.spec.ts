import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerSmallComponent } from './loading-spinner-small.component';

describe('LoadingSpinnerSmallComponent', () => {
  let component: LoadingSpinnerSmallComponent;
  let fixture: ComponentFixture<LoadingSpinnerSmallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [LoadingSpinnerSmallComponent]
    });
    fixture = TestBed.createComponent(LoadingSpinnerSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

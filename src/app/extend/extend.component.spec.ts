import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendComponent } from './extend.component';

describe('ExtendComponent', () => {
  let component: ExtendComponent;
  let fixture: ComponentFixture<ExtendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendComponent]
    });
    fixture = TestBed.createComponent(ExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

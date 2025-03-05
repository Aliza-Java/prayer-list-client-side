import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendComponent } from './extend.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ExtendComponent', () => {
  let component: ExtendComponent;
  let fixture: ComponentFixture<ExtendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExtendComponent, HttpClientModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(ExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

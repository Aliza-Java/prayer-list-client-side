import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeComponent } from './unsubscribe.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UnsubscribeComponent', () => {
  let component: UnsubscribeComponent;
  let fixture: ComponentFixture<UnsubscribeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnsubscribeComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(UnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

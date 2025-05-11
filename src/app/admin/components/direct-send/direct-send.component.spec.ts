import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSendComponent } from './direct-send.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('DirectSendComponent', () => {
  let component: DirectSendComponent;
  let fixture: ComponentFixture<DirectSendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectSendComponent, LoadingSpinnerComponent], 
      imports: [HttpClientModule, ReactiveFormsModule], 
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123', // TODO: fill right parameters
              },
            },
          },
        },
      ]});
    fixture = TestBed.createComponent(DirectSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

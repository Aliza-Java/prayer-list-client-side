import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPreviewComponent } from './direct-preview.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';

describe('DirectPreviewComponent', () => {
    let component: DirectPreviewComponent;
    let fixture: ComponentFixture<DirectPreviewComponent>;

    const mockActivatedRoute = {
        snapshot: {
          queryParamMap: {
            get: (key: string) => {
              if (key === 't') return 'mock-token';
              if (key === 'email') return 'mock@example.com';
              return null;
            }
          }
        }
      };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DirectPreviewComponent, LoadingSpinnerComponent],
            imports: [HttpClientModule],
            providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        });
        fixture = TestBed.createComponent(DirectPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { TestBed } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthInterceptorService', () => {
  let service: AuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
      providers: [AuthInterceptorService], // Register the service
    });
    service = TestBed.inject(AuthInterceptorService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Check if the service is created
  });
});
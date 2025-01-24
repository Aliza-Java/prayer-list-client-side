import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
      providers: [AuthService], // Register the service
    });
    service = TestBed.inject(AuthService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Check if the service is created
  });
});
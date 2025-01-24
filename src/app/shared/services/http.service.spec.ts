import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';

describe('HttpService', () => {
  let service: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
      providers: [HttpService], // Register the service
    });
    service = TestBed.inject(HttpService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Check if the service is created
  });
});
import { TestBed } from '@angular/core/testing';
import { GuestService } from './guest.service';
import { HttpClientModule } from '@angular/common/http';

describe('GuestService', () => {
  let service: GuestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
      providers: [GuestService], // Register the service
    });
    service = TestBed.inject(GuestService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Check if the service is created
  });
});
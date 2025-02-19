import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { HttpClientModule } from '@angular/common/http';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
      providers: [AdminService], // Register the service
    });
    service = TestBed.inject(AdminService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Check if the service is created
  });
});
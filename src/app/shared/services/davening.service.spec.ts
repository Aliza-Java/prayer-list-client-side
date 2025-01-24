import { TestBed } from '@angular/core/testing';
import { DaveningService } from './davening.service';
import { HttpClientModule } from '@angular/common/http';

describe('DaveningService', () => {
  let service: DaveningService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
      providers: [DaveningService], // Register the service
    });
    service = TestBed.inject(DaveningService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Check if the service is created
  });
});
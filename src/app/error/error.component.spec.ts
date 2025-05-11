import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { DaveningService } from '../shared/services/davening.service';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let mockDaveningService: any;

  beforeEach(async () => {
    mockDaveningService = {
        errorMessage: 'Initial error message',
        setErrorMessage: function (msg: string) {
          this.errorMessage = msg;
        }
      };
    

    await TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      providers: [
        { provide: DaveningService, useValue: mockDaveningService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the message input correctly', () => {
    component.message = 'Test error message';
    fixture.detectChanges();

    // Example of checking template rendering if the message is displayed in the template
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test error message');
  });

  it('should clear the error message in DaveningService when clearMessage() is called', () => {
    expect(mockDaveningService.errorMessage).toBe('Initial error message');
    component.clearMessage();
    expect(mockDaveningService.errorMessage).toBe(''); 
  });
});

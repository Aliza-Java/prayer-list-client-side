import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginComponent } from './admin-login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { of } from 'rxjs';
import { AdminService } from '../../admin.service';

describe('AdminLoginComponent', () => {
    let component: AdminLoginComponent;
    let fixture: ComponentFixture<AdminLoginComponent>;
    let mockAuthService: jasmine.SpyObj<AuthService>;
   // let mockHttpService: jasmine.SpyObj<HttpService>;
   // let mockRouter: jasmine.SpyObj<Router>;
   // let mockDaveningService: jasmine.SpyObj<DaveningService>;

    beforeEach(async () => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
      //  mockHttpService = jasmine.createSpyObj('HttpService', ['login']);
      //  mockRouter = jasmine.createSpyObj('Router', ['login']);
       // mockDaveningService = jasmine.createSpyObj('DaveningService', ['login']);
        TestBed.configureTestingModule({
            imports: [HttpClientModule, ReactiveFormsModule],
            declarations: [AdminLoginComponent],
            providers: [{ provide: AuthService, useValue: mockAuthService },
                { 
                    provide: AdminService, 
                    useValue: {
                        listsSub: of(), // Mock the subscription
                        populateAdminDavenfors: jasmine.createSpy('populateAdminDavenfors'),
                        populateWeeklyCategory: jasmine.createSpy('populateWeeklyCategory'),
                        populateAdminSettings: jasmine.createSpy('populateAdminSettings'),
                        populateParashot: jasmine.createSpy('populateParashot'),
                        populateCategories: jasmine.createSpy('populateCategories'),
                       populateCurrentParasha: jasmine.createSpy('populateCurrentParasha'),
                        getDaveners: jasmine.createSpy('getDaveners'),
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with email and password controls', () => {
        const emailControl = component.loginForm.get('email');
        const passwordControl = component.loginForm.get('password');

        expect(emailControl).toBeTruthy();
        expect(passwordControl).toBeTruthy();
    });

    it('should validate the email control as required and valid email format', () => {
        const emailControl = component.loginForm.get('email');
        emailControl?.setValue('');
        expect(emailControl?.valid).toBeFalse();
        emailControl?.setValue('invalid-email');
        expect(emailControl?.valid).toBeFalse();
        emailControl?.setValue('test@example.com');
        expect(emailControl?.valid).toBeTrue();
    });

    it('should validate the password control as required', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('');
        expect(passwordControl?.valid).toBeFalse();
        passwordControl?.setValue('validpassword');
        expect(passwordControl?.valid).toBeTrue();
    });

    it('should call authService.login with correct email and password on form submit', () => {
        const email = 'test@example.com';
        const password = 'password123';

        component.loginForm.setValue({ email, password });
        component.onSubmit();

        expect(mockAuthService.login).toHaveBeenCalledWith(email, password);
    });

    it('should not call authService.login if the form is invalid', () => {
        component.loginForm.setValue({ email:'', password: ''});
        component.onSubmit();

        expect(mockAuthService.login).not.toHaveBeenCalled();
    });
});

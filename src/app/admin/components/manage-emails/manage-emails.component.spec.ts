import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailsComponent } from './manage-emails.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { AdminService } from '../../admin.service';
import { Davener } from 'src/app/shared/models/davener.model';
import { SharedModule } from 'src/app/shared/shared.module';

class MockAdminService {
    davenersChanged = of([]);
    daveners = [
      { id: 1, country: 'USA', email: 'test@example.com', whatsapp: 12345, active: true },
    ];
  
    editDavener() {}
    deleteDavener() {}
    disactivateDavener() {}
    activateDavener() {}
    addDavener() {}
  }
  
  describe('ManageEmailsComponent', () => {
    let component: ManageEmailsComponent;
    let fixture: ComponentFixture<ManageEmailsComponent>;
    let adminService: AdminService;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ManageEmailsComponent],
        imports: [FormsModule, HttpClientModule, SharedModule],
        providers: [
          DaveningService,
          HttpService,
          { provide: AdminService, useClass: MockAdminService },
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(ManageEmailsComponent);
      component = fixture.componentInstance;
      adminService = TestBed.inject(AdminService);
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should initialize with daveners from adminService', () => {
      expect(component.daveners).toEqual(adminService.daveners);
    });
  
    it('should update daveners on davenersChanged', () => {
        const newDaveners = [{ id: 2, country: 'Israel', email: 'new@example.com', whatsapp: 67890, active: true }];
        const davenersSubject = new Subject<Davener[]>(); // Use Subject to mock the behavior
        adminService.davenersChanged = davenersSubject;
      
        component.ngOnInit(); // Subscribes to davenersChanged
        davenersSubject.next(newDaveners); // Emit new value
      
        expect(component.daveners).toEqual(newDaveners);
      });
  
    it('should call adminService.editDavener on onSendEdit()', () => {
      spyOn(adminService, 'editDavener');
      component.davenerToEdit = { id: 1, country: 'USA', email: 'edit@example.com', whatsapp: 98765, active: true };
      component.onSendEdit();
      expect(adminService.editDavener).toHaveBeenCalledWith(component.davenerToEdit);
    });
  
    it('should reset davenerToEdit after onSendEdit()', () => {
      component.davenerToEdit = { id: 1, country: 'USA', email: 'edit@example.com', whatsapp: 98765, active: true };
      component.onSendEdit();
      expect(component.davenerToEdit).toEqual({ id: -1, country: '', email: '', whatsapp: 0, active: false });
    });
  
    it('should confirm before calling adminService.deleteDavener', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(adminService, 'deleteDavener');
      const davener = { id: 1, country: 'USA', email: 'delete@example.com', whatsapp: 12345, active: true };
      component.onDelete(davener);
      expect(adminService.deleteDavener).toHaveBeenCalledWith(davener.id, davener.email);
    });
  
    it('should not call adminService.deleteDavener if confirm is canceled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(adminService, 'deleteDavener');
      const davener = { id: 1, country: 'USA', email: 'delete@example.com', whatsapp: 12345, active: true };
      component.onDelete(davener);
      expect(adminService.deleteDavener).not.toHaveBeenCalled();
    });
  
    it('should call adminService.disactivateDavener on onDisactivate()', () => {
      spyOn(adminService, 'disactivateDavener');
      const davener = { id: 1, country: 'USA', email: 'test@example.com', whatsapp: 12345, active: true };
      component.onDisactivate(davener);
      expect(adminService.disactivateDavener).toHaveBeenCalledWith(davener);
    });
  
    it('should call adminService.activateDavener on onActivate()', () => {
      spyOn(adminService, 'activateDavener');
      const davener = { id: 1, country: 'USA', email: 'test@example.com', whatsapp: 12345, active: false };
      component.onActivate(davener);
      expect(adminService.activateDavener).toHaveBeenCalledWith(davener);
    });
  
    it('should add a davener through adminService on onAddDavener()', () => {
      spyOn(adminService, 'addDavener');
      const info = { country: 'Israel', email: 'add@example.com', whatsapp: '', active: true };
      component.onAddDavener(info);
      expect(adminService.addDavener).toHaveBeenCalledWith(jasmine.objectContaining({ country: 'Israel', email: 'add@example.com', whatsapp: 0 }));
    });
  
    it('should reset form and country on onCancelAdd()', () => {
      const mockForm = { reset: jasmine.createSpy('reset') };
      component.country = 'USA';
      component.onCancelAdd(mockForm as any);
      expect(mockForm.reset).toHaveBeenCalled();
      expect(component.country).toBe('Israel');
    });
  
    it('should unsubscribe from davenersChangedSub on ngOnDestroy()', () => {
      spyOn(component.davenersChangedSub, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.davenersChangedSub.unsubscribe).toHaveBeenCalled();
    });
  });
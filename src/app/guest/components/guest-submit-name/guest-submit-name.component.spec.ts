import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuestSubmitNameComponent } from './guest-submit-name.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DaveningService } from 'src/app/shared/services/davening.service';

describe('GuestSubmitNameComponent', () => {
    let component: GuestSubmitNameComponent;
    let fixture: ComponentFixture<GuestSubmitNameComponent>;
    let daveningServiceSpy: jasmine.SpyObj<DaveningService>;

    beforeEach(waitForAsync(() => {
        daveningServiceSpy = jasmine.createSpyObj('DaveningService', ['populateCategories']);
        daveningServiceSpy.populateCategories.and.returnValue(Promise.resolve(['refua', 'shidduchim', 'banim']));

        TestBed.configureTestingModule({
            imports: [HttpClientModule, ReactiveFormsModule],
            declarations: [GuestSubmitNameComponent],
            providers: [{ provide: DaveningService, useValue: daveningServiceSpy }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuestSubmitNameComponent);
        component = fixture.componentInstance;
        component.createForm();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

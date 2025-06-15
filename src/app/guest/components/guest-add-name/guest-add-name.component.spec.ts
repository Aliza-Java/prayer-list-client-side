import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuestAddNameComponent } from './guest-add-name.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DaveningService } from 'src/app/shared/services/davening.service';

describe('GuestAddNameComponent', () => {
    let component: GuestAddNameComponent;
    let fixture: ComponentFixture<GuestAddNameComponent>;
    let daveningServiceSpy: jasmine.SpyObj<DaveningService>;

    beforeEach(waitForAsync(() => {
        daveningServiceSpy = jasmine.createSpyObj('DaveningService', ['populateCategories']);
        daveningServiceSpy.populateCategories.and.returnValue(Promise.resolve(['refua', 'shidduchim', 'banim']));

        TestBed.configureTestingModule({
            imports: [HttpClientModule, ReactiveFormsModule],
            declarations: [GuestAddNameComponent],
            providers: [{ provide: DaveningService, useValue: daveningServiceSpy }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuestAddNameComponent);
        component = fixture.componentInstance;
        //component.createForm();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

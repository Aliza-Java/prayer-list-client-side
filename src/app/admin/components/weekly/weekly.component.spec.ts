import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeeklyComponent } from './weekly.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SelectDavenforsComponent } from 'src/app/select-davenfors/select-davenfors.component';
import { EmptyListComponent } from 'src/app/empty-list/empty-list.component';
import { AdminService } from '../../admin.service';
import { Parasha } from 'src/app/shared/models/parasha.model';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { Davenfor } from 'src/app/shared/models/davenfor.model';



describe('WeeklyComponent', () => {
    let component: WeeklyComponent;
    let fixture: ComponentFixture<WeeklyComponent>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;
    let daveningServiceSpy: jasmine.SpyObj<DaveningService>;

    beforeEach(() => {
        adminServiceSpy = jasmine.createSpyObj('AdminService', [
            'populateParashot']);

        const davenforsChangedSubject = new Subject<Davenfor[]>(); // or BehaviorSubject if that's what you use
        adminServiceSpy.davenforsChanged = davenforsChangedSubject;
    });

        beforeEach(waitForAsync(() => {
            adminServiceSpy.populateParashot.and.returnValue(Promise.resolve(new Parasha(-1, "", "", false)));

            daveningServiceSpy = jasmine.createSpyObj('DaveningService', ['populateCategories']);
            daveningServiceSpy.populateCategories.and.returnValue(Promise.resolve(['refua', 'shidduchim', 'banim']));

            TestBed.configureTestingModule({
                imports: [HttpClientModule, FormsModule],
                declarations: [WeeklyComponent, SelectDavenforsComponent, EmptyListComponent, LoadingSpinnerComponent],
                providers: [
                    { provide: AdminService, useValue: adminServiceSpy },
                    { provide: DaveningService, useValue: daveningServiceSpy }
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WeeklyComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });
    });

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeeklyComponent } from './weekly.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SelectDavenforsComponent } from 'src/app/select-davenfors/select-davenfors.component';
import { EmptyListComponent } from 'src/app/empty-list/empty-list.component';
import { AdminService } from '../../admin.service';
import { Parasha } from 'src/app/shared/models/parasha.model';
import { DaveningService } from 'src/app/shared/services/davening.service';

describe('WeeklyComponent', () => {
    let component: WeeklyComponent;
    let fixture: ComponentFixture<WeeklyComponent>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;
    let daveningServiceSpy: jasmine.SpyObj<DaveningService>;

    let bereishit:Parasha = new Parasha(1, "Bereishit", "בראשית");
    let noach:Parasha = new Parasha(2, "Noach", "נח");
    let lechlecha:Parasha = new Parasha(3, "Lech-Lecha", "לך-לך");

    beforeEach(waitForAsync(() => {
        adminServiceSpy = jasmine.createSpyObj('AdminService', [
            'populateParashot',
            'populateCurrentParasha'
          ]);
        adminServiceSpy.populateParashot.and.returnValue(Promise.resolve([bereishit, noach, lechlecha]));
        adminServiceSpy.populateCurrentParasha.and.returnValue(Promise.resolve(noach));

        daveningServiceSpy = jasmine.createSpyObj('DaveningService', ['populateCategories']);
        daveningServiceSpy.populateCategories.and.returnValue(Promise.resolve(['refua', 'shidduchim', 'banim']));

        TestBed.configureTestingModule({
            imports: [HttpClientModule, FormsModule],
            declarations: [WeeklyComponent, SelectDavenforsComponent, EmptyListComponent],
            providers: [
                {provide: AdminService, useValue: adminServiceSpy }, 
                {provide : DaveningService, useValue: daveningServiceSpy}
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

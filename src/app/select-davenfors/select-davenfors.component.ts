import { Component, Input, OnChanges } from '@angular/core';
import { Davenfor } from '../shared/models/davenfor.model';
import { GuestService } from '../guest/guest.service';
import { AdminService } from '../admin/admin.service';

@Component({
    selector: 'app-select-davenfors',
    templateUrl: './select-davenfors.component.html',
    styleUrls: ['./select-davenfors.component.css']
})
export class SelectDavenforsComponent implements OnChanges {

    @Input() category: string=''; //Need this for displaying empty-list

    @Input()
    davenfors: Davenfor[] = [];

    @Input()
    adminPermission: boolean=false; //Indicating if admin is logged in, sending to http customized url's

    constructor(public guestService: GuestService, public adminService: AdminService) {
    }

    ngOnChanges(): void {
    }

    onDelete(davenfor: Davenfor) {
        let name = (davenfor.nameEnglish?.trim().length == 0)? davenfor.nameHebrew : davenfor.nameEnglish; 
        if (confirm(`Are you sure you want to delete the name '${name}' ?`)) {//Get user permission before proceeding
            if (davenfor.id != undefined && davenfor.nameEnglish != undefined) {
                if (this.adminPermission) //Sent from admin user
                    this.adminService.deleteDavenfor(davenfor.id, name??'');
                else //done from a guest
                    this.guestService.deleteDavenfor(davenfor.id, name??'');
            }
            else
                console.error('Davenfor ID is ' + davenfor.id + ' and nameEnglish is ' + davenfor.nameEnglish);

        }
    }
} 
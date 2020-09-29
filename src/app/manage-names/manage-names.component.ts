import { Component, OnInit } from '@angular/core';
import {Davenfor} from '../shared/models/davenfor.model';

@Component({
    selector: 'app-manage-names',
    templateUrl: './manage-names.component.html',
    styleUrls: ['./manage-names.component.css']
})
export class ManageNamesComponent implements OnInit {

    
    needSpouse = false;
    myDavenfors: Davenfor[]= [
        new Davenfor(null, null, "aaa", "bbb", "ccc", "ddd", true, null, null, null, null), 
        new Davenfor(null, null, "aa1", "bb1", "cc1", "dd1", false, null, null, null, null), 
        new Davenfor(null, null, "aa2", "bb2", "cc2", "dd2", true, null, null, null, null), 
    ]; //need to initialize somewhere
    constructor() { }

    ngOnInit() {

    }

}

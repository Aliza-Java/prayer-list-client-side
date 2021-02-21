import { Component, OnInit, Input } from '@angular/core';
import { DaveningService } from '../shared/services/davening.service';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
    @Input() message: string;

    constructor(public daveningService:DaveningService) { }

    ngOnInit() {
    }

    clearMessage() {
        this.daveningService.successMessage="";
    }

}

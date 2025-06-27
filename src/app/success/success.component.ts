import { Component, OnInit, Input, Signal } from '@angular/core';
import { DaveningService } from '../shared/services/davening.service';

@Component({
    standalone: true,
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
    @Input({ required: true }) message!: Signal<string>;

    constructor(public daveningService:DaveningService) { }

    ngOnInit() {
    }

    clearMessage() {
        this.daveningService.setSuccessMessage('');
    }

}

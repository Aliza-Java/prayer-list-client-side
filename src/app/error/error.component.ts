import { Component, OnInit, Input, Signal } from '@angular/core';
import { DaveningService } from '../shared/services/davening.service';

@Component({
    standalone: true,
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    @Input({required: true}) message!: Signal<string>;

    constructor(public daveningService: DaveningService) { }

    ngOnInit() {
    }

    clearMessage() {
        this.daveningService.setErrorMessage('');
    }

}

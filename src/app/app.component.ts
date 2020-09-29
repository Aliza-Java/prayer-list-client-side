import { Component } from '@angular/core';
import { DaveningService } from 'src/app/shared/services/davening.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})



export class AppComponent {
    constructor(private daveningService: DaveningService) { }
    title = 'Davening List';
}

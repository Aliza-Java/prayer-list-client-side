import { Component, OnInit } from '@angular/core';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from './shared/services/http.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
    constructor(public daveningService: DaveningService, public httpService: HttpService) {}

    ngOnInit() {}
}

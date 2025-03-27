import { Component, OnInit } from '@angular/core';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from './shared/services/http.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    constructor(private router: Router, public daveningService: DaveningService, public httpService:HttpService ) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd) // Only trigger on navigation completion
        ).subscribe(() => {
            this.changeOfRoutes(); // Call the method on navigation
        });
    }

    ngOnInit() { }

    changeOfRoutes() {
        if (this.daveningService.shouldClearMessages()) 
            this.daveningService.clearMessages();
    }
}
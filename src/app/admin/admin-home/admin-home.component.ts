import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { Subscription } from 'rxjs';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit, OnDestroy {

    choice: string = '';
    addDavenforSub!: Subscription;  // Asserting that it will be assigned before usage

    //TODO:  Ensure you unsubscribe from subscriptions in ngOnDestroy to prevent memory leaks.
    constructor(public authService: AuthService, public adminService: AdminService, public daveningService: DaveningService,
        public router: Router,
        public route: ActivatedRoute,
        public httpService: HttpService) {
         }

    ngOnInit() {
        this.addDavenforSub = this.httpService.davenforAdded.subscribe(addedAlready => {
            this.router.navigate(['names']);
        })
    }

    changeOfRoutes() {
        this.daveningService.clearMessages();
    }

    ngOnDestroy() {
        this.addDavenforSub.unsubscribe();
    }
}
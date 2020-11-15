import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit, OnDestroy {

    choice: string;
    addDavenforSub:Subscription;
    constructor(public adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService) { }

    ngOnInit() {
        this.addDavenforSub = this.httpService.davenforAdded.subscribe(addedAlready => {
            this.router.navigate['names'];
        })

    }

    ngOnDestroy(){
        this.addDavenforSub.unsubscribe();
    }


}

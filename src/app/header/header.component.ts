import { Component, OnInit } from '@angular/core';
import { AuthService } from '../admin/auth/auth.service';
import { DaveningService } from '../shared/services/davening.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(public daveningService: DaveningService, public authService: AuthService) { }

    ngOnInit() { }

    logout() {
        this.authService.logout();
    }
}
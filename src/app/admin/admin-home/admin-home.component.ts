import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

    choice: string;

    constructor(private adminService: AdminService, 
                private router:Router, 
                private route:ActivatedRoute) { }

    ngOnInit() {
    }

   
}

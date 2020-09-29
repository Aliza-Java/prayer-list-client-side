import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';

@Component({
    selector: 'app-guest-home',
    templateUrl: './guest-home.component.html',
    styleUrls: ['./guest-home.component.css']
})
export class GuestHomeComponent implements OnInit {
addNameMode=false;
   
    guestEmail: string = "";
    constructor(private router: Router,
        private route: ActivatedRoute, 
        private daveningService:DaveningService) { }

    ngOnInit() {
    }
 
    onClickNew(){
        this.addNameMode=true;
    }

    onChangeEmail(email:string){
        this.daveningService.emailChanged.next(email);
    }


   

}

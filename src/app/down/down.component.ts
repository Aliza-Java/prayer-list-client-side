import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { DaveningService } from '../shared/services/davening.service';

@Component({
  selector: 'app-down',
  standalone: true,
  templateUrl: './down.component.html',
  styleUrls: ['./down.component.css']
})
export class DownComponent {
    constructor(public router:Router){}

    goToHome(){
        this.router.navigate(['guest']);
    }

}

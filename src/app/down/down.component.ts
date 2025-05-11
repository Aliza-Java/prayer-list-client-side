import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

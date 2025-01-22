import { Component, OnInit, Input } from '@angular/core';
import { DaveningService } from '../shared/services/davening.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    @Input() message:string = '';

  constructor(public daveningService:DaveningService) { }

  ngOnInit() {
  }

  clearMessage(){
      this.daveningService.errorMessage = "";
  }

}

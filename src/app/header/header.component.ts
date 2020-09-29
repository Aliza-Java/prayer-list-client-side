import { Component, OnInit } from '@angular/core';
import { DaveningService } from '../shared/services/davening.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public daveningService:DaveningService) { }

  ngOnInit() {
  }

}

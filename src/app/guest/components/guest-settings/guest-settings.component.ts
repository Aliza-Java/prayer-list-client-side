import { Component, OnInit } from '@angular/core';
import { DaveningService } from 'src/app/shared/services/davening.service';

@Component({
  selector: 'app-guest-settings',
  templateUrl: './guest-settings.component.html',
  styleUrls: ['./guest-settings.component.css']
})
export class GuestSettingsComponent implements OnInit {

  constructor(public daveningService:DaveningService) {  }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template:  `
  <div class="spinner-overlay" *ngIf="isLoading">
    <div class="loadingio-spinner-spinner-gmxoza6r5b">
      <div class="ldio-qqux2h4riwk">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {
    @Input() isLoading = false; // Control visibility from parent


  constructor() { }

  ngOnInit(): void {
  }

}

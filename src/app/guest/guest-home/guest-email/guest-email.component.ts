import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
    selector: 'app-guest-email',
    templateUrl: './guest-email.component.html',
    styleUrls: ['./guest-email.component.css']
})
export class GuestEmailComponent implements OnInit {

    addNameMode = false;
    changeEmailAllowed = true;
    guestEmailForm: FormGroup;


    constructor(
        public daveningService: DaveningService, public httpService:HttpService) { }

    ngOnInit() {
        this.guestEmailForm = new FormGroup({
            'emailInput': new FormControl(null, [Validators.required, Validators.email])
        });
    }

    onChangeEmail() {
        this.changeEmailAllowed = true;
    }

    onSaveEmail() {
        this.changeEmailAllowed = false;
        this.daveningService.guestEmail = this.guestEmailForm.get('emailInput').value;
        this.httpService.getDavenfors();
    }



}

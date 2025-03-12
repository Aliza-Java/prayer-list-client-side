import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GuestService } from '../guest/guest.service';
import { HttpService } from '../shared/services/http.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DaveningService } from '../shared/services/davening.service';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-unsubscribe',
  imports: [CommonModule, ReactiveFormsModule, SharedModule], 
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent {

unsubscribeForm: UntypedFormGroup = new UntypedFormGroup({});

loading:boolean = false;

    constructor(public daveningService:DaveningService, 
        public httpService:HttpService, 
        public guestService:GuestService, 
        public http:HttpClient) {
        daveningService.showHeaderMenu = false;
     }

    ngOnInit() {
        
        this.unsubscribeForm = new UntypedFormGroup({
            'email': new UntypedFormControl(null,[Validators.required, Validators.email]),
        });
    }

    onSubmit(){
        if(this.unsubscribeForm.valid)
        {
            this.daveningService.setLoading(true);
            let email:string = this.unsubscribeForm.value['email'];
            console.log(this.httpService.baseUrl + "user/unsubscribe/request?email=" + email);
                this.http.get<{ message: string }>(this.httpService.baseUrl + "user/unsubscribe/request?email=" + email)
                .pipe(finalize(() => this.daveningService.setLoading(false))).subscribe({
                    next: response => {
                        console.log("Response:", response);
                        this.daveningService.setSuccessMessage(response.message);
                    },
                    error: err => {
                        console.error("Error:", err);
                        this.daveningService.setErrorMessage("There was an error sending the email.  Try again later, or contact your admin.");
                    }
                  });
            }
        }
}

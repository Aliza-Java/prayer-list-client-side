import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { finalize } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-direct-send',
    templateUrl: './direct-send.component.html',
    styleUrls: ['./direct-send.component.css']
})
export class DirectSendComponent {

    constructor(public daveningService: DaveningService,
        private route: ActivatedRoute,
        public adminService: AdminService,
        public httpService: HttpService,
        public authService: AuthService,
        public router: Router) { }

    sent: boolean = false;
    sendForm: UntypedFormGroup = new UntypedFormGroup({});


    ngOnInit() {
        this.sendForm = new UntypedFormGroup({
            'password': new UntypedFormControl(null, Validators.required)
        });
    }

    onSubmit() {
        this.daveningService.loading.set(true);
        const token = this.route.snapshot.queryParamMap.get('t') || '';
        const email = this.route.snapshot.queryParamMap.get('email') || '';

        this.httpService.sendDirect(token, email, this.sendForm.value['password']).pipe(
            finalize(() => this.daveningService.loading.set(false))).subscribe(
                (response) => {
                    console.log(response);
                    this.daveningService.setSuccessMessage("The list has been sent out", true);
                    this.sent = true;
                },
                (err: any) => {
                    console.log(err.error.message);
                    if (err?.error?.message?.length > 0) {
                        this.daveningService.setErrorMessage(err.error.message);
                    } else {
                        this.daveningService.setErrorMessage("An unexpected error occurred.");
                    }
                }
            );
    }

    goToWebsite() {
        this.router.navigate(['admin']);
    }
}

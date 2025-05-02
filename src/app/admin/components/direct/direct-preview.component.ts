import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DaveningService } from 'src/app/shared/services/davening.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../../admin.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-direct-preview',
    templateUrl: './direct-preview.component.html',
    styleUrls: ['./direct-preview.component.css']
})
export class DirectPreviewComponent {
    constructor(public daveningService: DaveningService,
        private route: ActivatedRoute,
        public adminService: AdminService,
        public httpService: HttpService,
        public authService: AuthService,
        public router: Router) { }

    ngOnInit() {
        this.daveningService.setLoading(true);
        const token = this.route.snapshot.queryParamMap.get('t') || '';
        const email = this.route.snapshot.queryParamMap.get('email') || '';

        this.httpService.previewDirect(token, email).pipe(
            finalize(() => this.daveningService.setLoading(false))).subscribe(
                (res: any) => {
                    var win = window.open("", "Preview this week's list", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=630,top=20");
                    if (win) {
                        win.document.open(); // Open the document for writing
                        win.document.write(res); // Write the entire HTML string
                        win.document.close(); // Close the document to signal completion
                        win.resizeTo(660, win.outerWidth);  // Resize after writing the document
                    }
                },
                (err: any) => {
                    console.error('POST failed:', err);
                    this.daveningService.setErrorMessage("There was an error generating the preview.");
                }
            );
    }

    goToWebsite(){
        this.router.navigate(['admin']);
    }

}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { DaveningService } from '../shared/services/davening.service';
import { SharedModule } from '../shared/shared.module';
import { finalize } from 'rxjs';
import { HttpService } from '../shared/services/http.service';

@Component({
    selector: 'app-delete-confirm',
    standalone: true,
    imports: [NgIf, SharedModule, CommonModule],
    templateUrl: './delete-confirm.component.html',
    styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent {

    token: string | null = '';
    dfId: string | null = '';
    responseMessage: string | null = null;
    isLoading: boolean = false;

    constructor(public daveningService: DaveningService, private route: ActivatedRoute, private httpService: HttpService, private router: Router) {
        daveningService.showHeaderMenu = false;

        this.dfId = this.route.snapshot.queryParamMap.get('id') ?? '';
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    }

    confirmDelete() {
        if (this.isLoading)
            return;

        this.isLoading = true;
        this.daveningService.loading.set(true);        
        this.httpService.deleteNameFromEmail(this.dfId ?? '', this.token ?? '')
            .pipe(finalize(() => this.daveningService.loading.set(false)))
                        .subscribe(response => {
                console.log('Response received:', response);
                this.extractAndInjectStyles(response);
                this.responseMessage = response;
            }, error => {
                console.error('Error occurred:', error);
                this.extractAndInjectStyles(error);
                this.responseMessage = error;
            });
    }

    cancel() {
        this.router.navigate(['']);
    }

    extractAndInjectStyles(html: string) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const styles = tempDiv.querySelectorAll('style');
        styles.forEach(style => {
            document.head.appendChild(style); // Append styles to <head>
        });
    }
}
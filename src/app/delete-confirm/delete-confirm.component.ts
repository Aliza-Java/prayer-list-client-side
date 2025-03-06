import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { DaveningService } from '../shared/services/davening.service';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'app-delete-confirm',
    standalone: true,
    imports: [NgIf, SharedModule],
    templateUrl: './delete-confirm.component.html',
    styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent {

    token: string | null = '';
    dfId: string | null = '';
    responseMessage: string | null = null;
    isLoading: boolean = false;

    constructor(daveningService: DaveningService, private route: ActivatedRoute, private http: HttpClient, private router: Router) {
        daveningService.showHeaderMenu = false;

        this.dfId = this.route.snapshot.queryParamMap.get('id');
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    }

    confirmDelete() {
        if (this.isLoading)
            return;

        this.isLoading = true;
        this.http.delete(`http://localhost:8080/dlist/direct/delete/${this.dfId}/${this.token}`, { responseType: 'text' })
            .subscribe(response => {
                console.log('Response received:', response);
                this.extractAndInjectStyles(response);
                this.responseMessage = response;
                this.isLoading = false;
            }, error => {
                console.error('Error occurred:', error);
                this.extractAndInjectStyles(error);
                this.responseMessage = error;
                this.isLoading = false;
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
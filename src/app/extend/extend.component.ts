import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule, NgIf } from '@angular/common';
import { DaveningService } from '../shared/services/davening.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpService } from '../shared/services/http.service';

@Component({
    selector: 'app-extend',
    standalone: true,
    imports: [NgIf, SharedModule, CommonModule],
    templateUrl: './extend.component.html',
    styleUrls: ['./extend.component.css']
})
export class ExtendComponent {
    token: string | null = '';
    dfId: string | null = '';
    responseMessage: string | null = null;
    isLoading: boolean = false;
    name: string | null = "this name";

    constructor(public daveningService: DaveningService, private route: ActivatedRoute, private httpService:HttpService, private router: Router) {
        daveningService.showHeaderMenu = false;

        this.dfId = this.route.snapshot.queryParamMap.get('id');
        this.name = this.route.snapshot.queryParamMap.get('name') ? this.route.snapshot.queryParamMap.get('name') : 'this name';
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    }

    confirmExtend() {
        if (this.isLoading)
            return;

        this.isLoading = true;
        this.daveningService.setLoading(true);          
        this.httpService.extendFromEmail(this.dfId ?? '', this.token ?? '')
            .pipe(finalize(() => this.daveningService.setLoading(false)))
            .subscribe((response: any) => {
                console.log('Response received:', response);
                this.extractAndInjectStyles(response);
                this.responseMessage = response;
            }, (error: any) => {
                console.error('Error occurred:', error);
                this.extractAndInjectStyles(error);
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
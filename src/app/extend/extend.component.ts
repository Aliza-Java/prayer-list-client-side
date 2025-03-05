import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NgIf } from '@angular/common';
import { DaveningService } from '../shared/services/davening.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-extend',
  standalone: true,
  imports: [NgIf, SharedModule],
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.css']
})
export class ExtendComponent {
    token: string | null = '';
    dfId: string | null = '';
    responseMessage: string | null = null;
    isLoading: boolean = false;
    name: string | null = "this name";

    constructor(private daveningService: DaveningService, private route: ActivatedRoute, private http: HttpClient, private router: Router) {
        daveningService.showHeaderMenu = false;

        this.dfId = this.route.snapshot.queryParamMap.get('id');
        this.name = this.route.snapshot.queryParamMap.get('name') ? this.route.snapshot.queryParamMap.get('name') : 'this name';
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    } 

    confirmExtend() {
        if (this.isLoading)
            return;

        this.isLoading = true;
        this.http.get(`http://localhost:8080/dlist/direct/extend/${this.dfId}/${this.token}`, { responseType: 'text' })
            .subscribe((response: string) => {
                console.log('Response received:', response);
                this.extractAndInjectStyles(response);
                this.responseMessage = response;
                this.isLoading = false;
            }, (error: string) => {
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
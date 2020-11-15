import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Davenfor } from '../models/davenfor.model';
import { AdminService } from './admin.service';
import { DaveningService } from './davening.service';
import { SimpleDavenfor } from '../models/simple-davenfor.model';
import { Category } from '../models/category.model';
import { Admin } from '../models/admin.model';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Davener } from '../models/davener.model';


@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private baseUrl = "http://localhost:8080/dlist/"; //TODO: move schema values to schema.  how?
    public davenforAdded = new Subject<Boolean>();

    constructor(private adminService: AdminService, private daveningService: DaveningService, private http: HttpClient, private router: Router) {
        this.getCategories();
    }

    public login(email: string, password: string) {
        const adminCredentials = new Admin(-1, email, password, false, 0); //sending email and password.
        this.http.post<Admin>(this.baseUrl + 'login', adminCredentials, { withCredentials: true })
            .subscribe(response => {
                this.adminService.adminLogin = response;
                this.router.navigate(['admin/']);
            },
                error => {
                    console.log(error)
                });
    }


    getDavenfors() {
        let url: string = '';

        //different url for admin/submitter
        if (this.adminService.adminLogin) {
            url = this.baseUrl + 'admin/davenfors';
        }
        else { //submitter retrieving
            url = this.baseUrl + 'getmynames/' + this.daveningService.guestEmail;
        }

        this.http.get<Davenfor[]>(url)
            .subscribe(names => {
                this.daveningService.davenfors = names;
                this.daveningService.davenforsChanged.next(names); //buzz the event, so every subscribing component reacts accordingly.
                console.log(names); //TODO: delete all console logs that seem to be for debugging purposes
            },
                error => {
                    if (error.status == '404') {
                        this.daveningService.davenforsChanged.next([]);
                    } //TODO: do something here.
                });
    }

    editDavenfor(davenfor: Davenfor) {
        //make getEmail a function?
        const email = this.adminService.adminLogin ? this.adminService.adminLogin.email : this.daveningService.guestEmail;
        this.http.put<Davenfor>((this.baseUrl + 'updatename/' + email), davenfor).subscribe(
            response => { console.log(response) },
            error => { console.log(error) }
        )
    }

    deleteDavenfor(davenforId: number) {
        let observable: Observable<Response>;
        if (this.adminService.adminLogin) {
            observable = this.http.delete<Response>(this.baseUrl + 'admin/delete/' + davenforId);
        }
        else observable = this.http.delete<Response>((this.baseUrl + 'delete/' + davenforId), { params: { 'email': this.daveningService.guestEmail } });

        observable.subscribe(
            () => { this.getDavenfors() },//refreshing list reflects deleted item.
            error => { console.log(error) } // TODO: and error message
        );
    }

    addDavenfor(basicInfo: SimpleDavenfor) {

        const today = new Date().toISOString().split('T')[0]; //used multiple times in the new Davenfor.
        const newDavenfor = new Davenfor(
            -1,
            this.daveningService.getSubmitter(basicInfo.submitterEmail),
            basicInfo.category,
            basicInfo.nameHebrew,
            basicInfo.nameEnglish,
            basicInfo.nameHebrewSpouse,
            basicInfo.nameEnglishSpouse,
            basicInfo.submitterToReceive,
            today, //lastConfirmedAt
            null, //expireAt: server will set the right one
            today, //createdAt
            today); //updatedAt

        this.http.post<Davenfor>(this.baseUrl + basicInfo.submitterEmail, newDavenfor).subscribe(
            () => {
                this.getDavenfors();
                this.davenforAdded.next(true); //to have guest and admin home pages route accordingly to the names list   
            },
            error => { console.log(error) }
        );
    }


    getDaveners() {
        this.http.get<Davener[]>(this.baseUrl + 'admin/daveners')
            .subscribe(daveners => {
                this.daveningService.daveners = daveners;
                this.daveningService.davenersChanged.next(daveners);
                console.log(daveners); //TODO: delete all console logs that seem to be for debugging purposes
            },
                error => {
                    console.log(error);
                });
    }

    deleteDavener(davenerId: number) {
        this.http.delete<Response>(this.baseUrl + 'admin/davener/' + davenerId)
            .subscribe(
                () => { this.getDaveners() },//refreshing list reflects deleted item.
                error => { console.log(error) } // TODO: and error message
            );
    }

    disactivateDavener(davener: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/disactivate/' + davener.email, null, { withCredentials: true });

    }

    activateDavener(davener: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/activate/' + davener.email, null, { withCredentials: true });
    }

    getCategories() {
        this.http.get<Category[]>(this.baseUrl + 'categories').subscribe(
            response => { this.daveningService.categories = response; },
            error => { console.log(error); }
        );
    }

    addDavener(davenerToAdd: Davener) {
        this.http.post<Davener[]>(this.baseUrl + 'admin/davener', davenerToAdd, { withCredentials: true })
            .subscribe(
                daveners => {
                    this.daveningService.daveners = daveners;
                    this.daveningService.davenersChanged.next(daveners); 
                    //TODO: need to make a success message - email ... will receive the davening lists.  if exists already, tell them that was just activated.
                },
                error => console.log(error)
            );
    }

    editDavener(davener:Davener){
        this.http.put<Davener[]>(this.baseUrl + 'admin/davener', davener, {withCredentials: true})
        .subscribe(
            daveners=>{
                this.daveningService.daveners = daveners;
                this.daveningService.davenersChanged.next(daveners); 
            },
            error=>console.log(error)
        );
    }


}


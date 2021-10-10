import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Davenfor } from '../models/davenfor.model';
import { Category } from '../models/category.model';
import { Admin } from '../models/admin.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Davener } from '../models/davener.model';
import { Parasha } from '../models/parasha.model';
import { Weekly } from '../models/weekly.model';
import { Submitter } from '../models/submitter.model';


@Injectable({
    providedIn: 'root'
})
export class HttpService {  //A service that makes the calls to the server

    private localhostUrl = "http://localhost:5000/dlist/";
    private awsUrl = "http://daveninglist.us-east-1.elasticbeanstalk.com/dlist/";

    //change this depending on the server location
    private baseUrl = this.localhostUrl;

    public davenforAdded = new Subject<Boolean>();

    constructor(public http: HttpClient, public router: Router) {
        this.getCategories();
        this.getParashot();
        this.getCurrentParasha();
        this.getCurrentCategory();
    }

    public login(email: string, password: string) {
        const adminCredentials = new Admin(-1, email, password, false, 0); //sending email and password.
        return this.http.post<Admin>(this.baseUrl + 'login', adminCredentials, { withCredentials: true });
    }


    getDavenfors(url: string) {
        return this.http.get<Davenfor[]>(this.baseUrl + url);
    }

    editDavenfor(url: string, davenfor: Davenfor) {
        //make getEmail a function?
        return this.http.put<Davenfor>((this.baseUrl + url), davenfor);
    }

    //separated from submitter's editDavenfor mainly because of return type
    adminEditDavenfor(url: string, davenfor:Davenfor){
        return this.http.put<Davenfor[]>((this.baseUrl + url), davenfor);
    }

    deleteDavenfor(url: string) {
        return this.http.delete<Davenfor[]>(this.baseUrl + url);
    }


    addDavenfor(submitterEmail: string, newDavenfor: Davenfor) {
        return this.http.post<Davenfor>(this.baseUrl + submitterEmail, newDavenfor);
    }


    public getDaveners() {
        return this.http.get<Davener[]>(this.baseUrl + 'admin/daveners');
    }

    deleteDavener(davenerId: number) {
        return this.http.delete<Response>(`${this.baseUrl}admin/davener/${davenerId}`, { withCredentials: true });
    }

    disactivateDavener(davener: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/disactivate/' + davener.email, null, { withCredentials: true });

    }

    activateDavener(davener: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/activate/' + davener.email, null, { withCredentials: true });
    }

    getCategories() {
        return this.http.get<Category[]>(this.baseUrl + 'categories');
    }

    addDavener(davenerToAdd: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/davener', davenerToAdd, { withCredentials: true });
    }

    editDavener(davener: Davener) {
        return this.http.put<Davener[]>(this.baseUrl + 'admin/davener', davener, { withCredentials: true });
    }

    getParashot() {
        return this.http.get<Parasha[]>(this.baseUrl + 'admin/parashot');
    }

    getCurrentParasha() {
        return this.http.get<Parasha>(this.baseUrl + 'admin/parasha');
    }

    getCurrentCategory() {
        return this.http.get<Category>(this.baseUrl + 'admin/category');
    }

    sendWeekly(weeklyInfo: Weekly) {
        return this.http.post<boolean>(this.baseUrl + 'admin/weekly/', weeklyInfo);
    }

    //use something like this: this.httpClient.request('GET', 'url, {responseType:'text'});

    preview(weeklyInfo: Weekly) {

        this.http.post(this.baseUrl + 'admin/preview', weeklyInfo, { responseType: 'text', withCredentials: true })
            .subscribe(
                res => {
                    var win = window.open("", "Preview this week's list", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=" + (screen.height - 20) + ",top=20,left=" + (screen.width - 840));
                    win.document.body.innerHTML = res;
                },
                error => console.log(error)
            );
    }

    getSubmitter(submitterEmail: string) { //This needs to be changed to dynamic retrieval
        return new Submitter(1, "myName", "submitter@smail.com", 101101, 101102, []);
    }

    sendUrgent(urgentDavenfor: Davenfor) {
        return this.http.post<boolean>(this.baseUrl + 'admin/urgent', urgentDavenfor);
    }
}
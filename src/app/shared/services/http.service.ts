import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Davenfor } from '../models/davenfor.model';
import { Admin } from '../models/admin.model';
import { Router } from '@angular/router';
import { Davener } from '../models/davener.model';
import { Weekly } from '../models/weekly.model';
import { JwtResponse } from '../models/jwt-response';
import { AdminSettings } from '../models/admin-settings.model';
import { Parasha } from '../models/parasha.model';

@Injectable({
    providedIn: 'root'
})
export class HttpService {  //A service that makes the calls to the server

    localhostUrl = "http://localhost:8080/dlist/";

    //change baseUrl depending on the server location
    public baseUrl = this.localhostUrl;

    constructor(public http: HttpClient, public router: Router) {
    }

    public login(email: string, password: string) {
        const adminCredentials = { "username": email, "password": password };
        return this.http.post<JwtResponse>(this.baseUrl + 'auth/signin', adminCredentials, { withCredentials: true });
    }

    public previewDirect(token: string, email: string) {
        const tokenCredentials = { "token": token, "email": email };
        return this.http.post(this.baseUrl + 'direct/preview', tokenCredentials, {
            responseType: 'text',
            withCredentials: true
        });
    }

    public sendDirect(token: string, email: string, password: string) {
        const tokenCredentials = { "token": token, "email": email, "password": password };
        return this.http.post(this.baseUrl + 'direct/send', tokenCredentials, { withCredentials: true });
    }

    public getAdminSettings(email: string) {
        return this.http.get<AdminSettings>(`${this.baseUrl}admin/settings/${email}`, { withCredentials: true });
    }

    getDavenfors(url: string) {
        return this.http.get<Davenfor[]>(this.baseUrl + url);
    }

    getParasha(url: string) {
        return this.http.get<Parasha>(this.baseUrl + url);
    }

    getParashot(url: string) {
        return this.http.get<Parasha[]>(this.baseUrl + url);
    }

    editDavenfor(url: string, davenfor: Davenfor) {
        return this.http.put<Davenfor>((this.baseUrl + url), davenfor);
    }

    //separated from submitter's editDavenfor mainly because of return type
    adminEditDavenfor(url: string, davenfor: Davenfor) {
        return this.http.put<Davenfor[]>((this.baseUrl + url), davenfor);
    }

    deleteDavenfor(url: string) {
        return this.http.delete<Davenfor[]>(this.baseUrl + url);
    }

    addDavenfor(userEmail: string, newDavenfor: Davenfor) {
        console.log(newDavenfor);
        return this.http.post<Davenfor>(this.baseUrl + 'user/' + userEmail, newDavenfor);
    }

    public getDaveners() {
        return this.http.get<Davener[]>(this.baseUrl + 'admin/users');
    }

    deleteDavener(davenerId: number) {
        return this.http.delete<Response>(`${this.baseUrl}admin/user/${davenerId}`, { withCredentials: true });
    }

    disactivateDavener(davener: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/disactivate/' + davener.email, null, { withCredentials: true });
    }

    activateDavener(davener: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/activate/' + davener.email, null, { withCredentials: true });
    }

    addDavener(davenerToAdd: Davener) {
        return this.http.post<Davener[]>(this.baseUrl + 'admin/user', davenerToAdd, { withCredentials: true });
    }

    editDavener(davener: Davener) {
        return this.http.put<Davener[]>(this.baseUrl + 'admin/user', davener, { withCredentials: true });
    }

    getCurrentCategory() {
        return this.http.get<string>(this.baseUrl + 'admin/category');
    }

    getCategories() {
        return this.http.get<string[]>(`${this.baseUrl}user/categories`);
    }

    verify(password: string, email: string) {
        const passwordAsJson = { 'password': password };
        return this.http.post<boolean>(this.baseUrl + 'admin/checkpass/' + email, passwordAsJson, { withCredentials: true });
    }

    sendWeekly(weeklyInfo: Weekly) {
        return this.http.post<boolean>(this.baseUrl + 'admin/weekly', weeklyInfo);
    }

    preview(weeklyInfo: Weekly) {
        return this.http.post(this.baseUrl + 'admin/preview', weeklyInfo, { responseType: 'text', withCredentials: true });
    }

    sendUrgent(urgentDavenfor: Davenfor) {
        return this.http.post<boolean>(this.baseUrl + 'admin/urgent', urgentDavenfor);
    }

    editAdminSettings(settings: Admin) {
        return this.http.put<Admin>(this.baseUrl + 'admin/update', settings, { withCredentials: true });
    }

    extendFromEmail(dfId: string, token: string) {
        return this.http.get(`${this.baseUrl}direct/extend/${dfId}/${token}`, { responseType: 'text' });
    }

    deleteNameFromEmail(dfId: string, token: string) {
        return this.http.delete(`${this.baseUrl}direct/delete/${dfId}/${token}`, { responseType: 'text' });
    }
}
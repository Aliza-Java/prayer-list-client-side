import { Injectable } from '@angular/core';
import { Admin } from '../models/admin.model';
import { SimpleAdmin } from '../models/simple-admin.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    //till get the real login system working
    //adminLogin: SimpleAdmin = new SimpleAdmin(1, "admin@davening.com");
    adminLogin: Admin;
    constructor() { }

    public login(email: string, password: string) {
        //TODO: real login to server, success if yes, error otherwise.
        this.adminLogin = new Admin(1, email, password, true, 3);
    }
}

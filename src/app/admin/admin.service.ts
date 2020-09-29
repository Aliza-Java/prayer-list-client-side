import { Injectable } from '@angular/core';
import { SimpleAdmin } from '../shared/models/simple-admin.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

//till get the real login system working
    adminLogin: SimpleAdmin = new SimpleAdmin(1, "admin@davening.com");
    constructor() { }
}

import { Davenfor } from './davenfor.model';

export class Submitter{
public id:number = 0;
public name:string = '';
public email:string = '';
public whatsapp:number = 0;
public phone:number = 0;
public davenfors:Davenfor[] = [];

    constructor(id:number, name:string, email:string,whatsapp:number, phone:number, davenfors:Davenfor[]){
        this.id = id;
        this.name = name;
        this.email=email;
        this.whatsapp = whatsapp;
        this.phone = phone; 
        this.davenfors = davenfors;
    }

}


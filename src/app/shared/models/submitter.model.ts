import { Davenfor } from './davenFor.model';

export class Submitter{
public id:number;
public name:string;
public email:string;
public whatsapp:number;
public phone:number;
public davenfors:Davenfor[];

    constructor(id:number, name:string, email:string,whatsapp:number, phone:number, davenfors:Davenfor[]){
        this.id = id;
        this.name = name;
        this.email=email;
        this.whatsapp = whatsapp;
        this.phone = phone; 
        this.davenfors = davenfors;
    }

}


export class Davener {
public id:number;
public country:string;
public email:string;
public whatsapp:number;
public active:boolean;

    constructor(id?:number, country?:string, email?:string, whatsapp?:number, active?:boolean){
        this.id = id;
        this.country = country;
        this.email = email;
        this.whatsapp = whatsapp;
        this.active = active;
    }
        
  }
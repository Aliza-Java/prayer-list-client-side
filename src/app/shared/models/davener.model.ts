export class Davener { //referred in UI as 'User'
public id:number;
public country:string = '';
public email:string = '';
public whatsapp:number = 0;
public active:boolean = true;

    constructor(id?:number, country?:string, email?:string, whatsapp?:number, active?:boolean){
        this.id = id ?? 0;
        this.country = country ?? '';
        this.email = email ?? '';
        this.whatsapp = whatsapp ?? 0;
        this.active = active ?? true;
    }         
  }
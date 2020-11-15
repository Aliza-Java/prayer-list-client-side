export class Schema{
private baseUrl = "http://localhost:8080/dlist/";


    public getSubmitterDavenfors(email:string){
        return (this.baseUrl + 'getmynames/'+email);
    }
}
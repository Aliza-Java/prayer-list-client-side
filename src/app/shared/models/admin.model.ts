export class Admin {
    id?: number = 0;
    email?: string = '';
    password?: string = '';
    newNamePrompt?: boolean = false;
    waitBeforeDeletion?: number = 7;

    constructor(id: number, email: string, password: string, newNamePrompt: boolean, waitBeforeDeletion: number) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.newNamePrompt = newNamePrompt;
        this.waitBeforeDeletion = waitBeforeDeletion;
    }
}
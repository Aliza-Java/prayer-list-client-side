export class Admin {
    id: number;
    email: string;
    password: string;
    newNamePrompt: boolean;
    waitBeforeDeletion: number;

    constructor(id: number, email: string, password: string, newNamePrompt: boolean, waitBeforeDeletion: number) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.newNamePrompt = newNamePrompt;
        this.waitBeforeDeletion = waitBeforeDeletion;
    }
}
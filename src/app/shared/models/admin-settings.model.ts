export class AdminSettings {
    email?: string = '';
    newNamePrompt?: boolean = false;
    waitBeforeDeletion?: number = 7; 

    constructor(email: string, newNamePrompt: boolean, waitBeforeDeletion: number) {
        this.email = email;
        this.newNamePrompt = newNamePrompt;
        this.waitBeforeDeletion = waitBeforeDeletion;
    }
}
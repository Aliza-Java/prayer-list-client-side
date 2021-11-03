export class AdminSettings {
    email?: string;
    newNamePrompt?: boolean;
    waitBeforeDeletion?: number;

    constructor(email: string, newNamePrompt: boolean, waitBeforeDeletion: number) {
        this.email = email;
        this.newNamePrompt = newNamePrompt;
        this.waitBeforeDeletion = waitBeforeDeletion;
    }
}
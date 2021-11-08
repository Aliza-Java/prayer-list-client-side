export class Signin {
    id?: number;
    email?: string;

    setId(id: number) {
        this.id = id;
    }

    setEmail(email: string) {
        this.email = email;
    }

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }
}
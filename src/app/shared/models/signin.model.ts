export class Signin {
    id?: number = 0;
    password?: string = '';
    email?: string = '';

    setId(id: number) {
        this.id = id;
    }

    setPassword(password: string) {
        this.password = password;   
    }

    setEmail(email: string) {
        this.email = email;
    }

    getId() {
        return this.id;
    }

    getPassword() {
        return this.password;   
    }

    getEmail() {
        return this.email;
    }
}
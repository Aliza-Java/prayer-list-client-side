export class JwtResponse {

    public constructor(
        public token?: string,
        public email?: string,
        public id?: number
    ) { }
}
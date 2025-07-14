//Designed to allow passing all the necessary information for the weekly list (including weekname in Hebrew)

export class Weekly {

    public constructor(

        public parashaNameEnglish?:string,
        public parashaNameHebrew?:string,
        public category?: string,
        public message?: string,
       
    ) { }
}

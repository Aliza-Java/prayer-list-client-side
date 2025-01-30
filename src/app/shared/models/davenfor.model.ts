
export class Davenfor {


    public constructor(

        public id?:number,
        public submitterEmail?: string,
        public category?: string,
        public nameHebrew?: string,
        public nameEnglish?: string,
        public nameHebrewSpouse?: string,
        public nameEnglishSpouse?: string,
        public submitterToReceive?: boolean,
        public lastConfirmedAt?: string,
        public expireAt?: string,
        public createdAt?: string,
        public updatedAt?: string
    ) { }

 }
//Designed to allow passing the basic information about a davenfor without reaching to database for complete info like full submitter, category etc.

export class SimpleDavenfor {

    public constructor(

        public category?:string,
        public userEmail?:string,
        public nameHebrew?: string,
        public nameEnglish?: string,
        public nameHebrewSpouse?: string,
        public nameEnglishSpouse?: string,
        public note?: string,
        public submitterToReceive?: boolean,

    ) { }

}
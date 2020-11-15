//Designed to allow passing the basic information about a davenfor without reaching to database for complete info like full submitter, category etc.

import { Category } from './category.model';

export class SimpleDavenfor {

    public constructor(

        public category?:Category,
        public submitterEmail?:string,
        public nameHebrew?: string,
        public nameEnglish?: string,
        public nameHebrewSpouse?: string,
        public nameEnglishSpouse?: string,
        public submitterToReceive?: boolean,

    ) { }

}
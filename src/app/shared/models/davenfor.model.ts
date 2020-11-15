import { Submitter } from './submitter.model';
import { Category } from './category.model';

export class Davenfor {


    public constructor(

        public id?:number,
        public submitter?: Submitter,
        public category?: Category,
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

    public getSubmitter(){
        return this.submitter;
    }

}
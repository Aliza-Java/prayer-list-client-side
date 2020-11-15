export class Category {

    public constructor(

        public id?:number,
        public english?: string,
        public hebrew?: string,
        public iscurrent?: boolean,
        public updateRate?: number,
        public catOrder?: number

    ) { }

}
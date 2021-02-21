//Designed to allow passing all the necessary information for the weekly list (including weekname in Hebrew)

export class Weekly {

    public constructor(

        public parashaName?:string,
        public fullWeekName?:string,
        public categoryId?: number,
        public message?: string,
       
    ) { }
}

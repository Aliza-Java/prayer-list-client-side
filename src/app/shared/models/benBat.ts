export enum BenBat {
    ben,
    bat
}

export namespace BenBat {
    export function keys() {
        return Object.keys(BenBat).filter(k => !isNaN(Number(k)));
    }
}
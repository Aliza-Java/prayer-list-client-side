import { Directive, ElementRef, Renderer2, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.open') toggleFlag = false;

    //dropdown is closable only if it itself is reclicked.
    /* @HostListener('click') toggleOpen(eventData: Event) {
             this.toggleFlag=!this.toggleFlag;
    } */

    //dropdown is closable from any part of the document
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.toggleFlag = this.elRef.nativeElement.contains(event.target) ? !this.toggleFlag : false;
    }
    constructor(private elRef: ElementRef) { }


}

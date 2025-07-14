import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { GuestService } from '../../guest.service';
import { DaveningService } from 'src/app/shared/services/davening.service';

@Component({
    selector: 'app-one-time-password',
    templateUrl: './one-time-password.component.html',
    styleUrls: ['./one-time-password.component.css']
})
export class OneTimePasswordComponent {

    code: string[] = ['', '', '', ''];

    @ViewChildren('input') inputs!: QueryList<ElementRef<HTMLInputElement>>;

    constructor(private guestService: GuestService, public daveningService: DaveningService) { }

    // Move cursor to next input on entry
    onInput(event: any, index: number) {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        // Allow only one digit
        if (value.length > 1) {
            this.code[index] = value.charAt(0);
            input.value = value.charAt(0);
        }


        if (/^[0-9]$/.test(value) && index < 3) {
            const nextInput = input.parentElement?.children[index + 1] as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        }
    }

    onKeyDown(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;

        if (event.key === 'Backspace' && input.value === '' && index > 0) {
            const prevInput = input.parentElement?.children[index - 1] as HTMLInputElement;
            if (prevInput) {
                prevInput.focus();
            }
        }
    }


    isCodeComplete(): boolean {
        return this.code.every(digit => digit.length === 1);
    }

    submitForm() {
        const finalCode = this.code.join('');
        this.daveningService.loading.set(true);
        this.guestService.loadGuest(finalCode);
    }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';

interface ActionItem {
    id: string;
    name: string;
    clicked?: 'confirm' | 'remove' | null;
    statusMessage?: string; // for inline feedback
    completed?: boolean; // new flag for grayed-out row
}

@Component({
    selector: 'app-confirm-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-list.component.html',
    styleUrl: './confirm-list.component.css'
})
export class ConfirmListComponent implements OnInit {
    title = "Are these names still relevant?";
    //todo - once spinner in, can remove this warning
    warning = "(Please note: confirming/deleting a name might take a few seconds)";

    token: string = "";
    category: string = "";
    actions: ActionItem[] = [];

    constructor(private httpService: HttpService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.category = this.route.snapshot.paramMap.get('category') || '';
        this.token = this.route.snapshot.paramMap.get('token') || '';
        const actionsParam = this.route.snapshot.queryParamMap.get('actions');
        if (actionsParam) {
            this.actions = actionsParam.split(',').map(pair => {
                const [id, name] = pair.split(':');
                return { id: id, name } as ActionItem;
            });
        }
    }


    confirm(item: ActionItem) {
        item.clicked = 'confirm';
        this.httpService.extendFromEmail(item.id, this.token)
            .subscribe({
                next: () => {
                    item.statusMessage = 'Confirmed!';
                    item.completed = true; // mark as completed for styling
                },
                error: () => item.statusMessage = 'Error confirming'
            });
    }

    remove(item: ActionItem) {
        item.clicked = 'remove';
        this.httpService.deleteNameFromEmail(item.id, this.token)
            .subscribe({
                next: () => {
                    item.statusMessage = 'Removed!';
                    item.completed = true;
                }, error: () => item.statusMessage = 'Error removing'
            });
    }

    isDisabled(item: ActionItem) {
        return !!item.clicked;
    }
}


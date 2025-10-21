import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';

interface ActionItem {
    id: string;
    name: string;
    clicked?: 'confirm' | null;
    statusMessage?: string; // for inline feedback
    completed?: boolean; // new flag for grayed-out row
}

@Component({
    selector: 'app-repost-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './repost-list.component.html',
    styleUrl: './repost-list.component.css'
})
export class RepostListComponent implements OnInit {
    title = "Would you like to repost these names?";
    //todo - once spinner in, can remove this warning
    warning = "(Please note: reposting a name might take a few seconds)";

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
                    item.statusMessage = 'Reposted!';
                    item.completed = true; // mark as completed for styling
                },
                error: () => item.statusMessage = 'Error confirming'
            });
    }

    isDisabled(item: ActionItem) {
        return !!item.clicked;
    }
}


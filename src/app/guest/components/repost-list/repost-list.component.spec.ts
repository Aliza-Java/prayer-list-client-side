import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepostListComponent } from './repost-list.component';

describe('RepostListComponent', () => {
  let component: RepostListComponent;
  let fixture: ComponentFixture<RepostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepostListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

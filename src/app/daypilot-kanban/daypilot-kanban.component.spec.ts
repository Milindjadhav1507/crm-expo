import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaypilotKanbanComponent } from './daypilot-kanban.component';

describe('DaypilotKanbanComponent', () => {
  let component: DaypilotKanbanComponent;
  let fixture: ComponentFixture<DaypilotKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaypilotKanbanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaypilotKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

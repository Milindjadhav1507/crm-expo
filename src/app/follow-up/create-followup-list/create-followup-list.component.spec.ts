import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFollowupListComponent } from './create-followup-list.component';

describe('CreateFollowupListComponent', () => {
  let component: CreateFollowupListComponent;
  let fixture: ComponentFixture<CreateFollowupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFollowupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFollowupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

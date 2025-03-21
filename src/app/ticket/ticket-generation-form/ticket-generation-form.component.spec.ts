import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGenerationFormComponent } from './ticket-generation-form.component';

describe('TicketGenerationFormComponent', () => {
  let component: TicketGenerationFormComponent;
  let fixture: ComponentFixture<TicketGenerationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketGenerationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketGenerationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

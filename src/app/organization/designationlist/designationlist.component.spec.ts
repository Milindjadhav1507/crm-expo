import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationlistComponent } from './designationlist.component';

describe('DesignationlistComponent', () => {
  let component: DesignationlistComponent;
  let fixture: ComponentFixture<DesignationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

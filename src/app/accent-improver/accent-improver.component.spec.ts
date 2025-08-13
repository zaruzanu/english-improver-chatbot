import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccentImproverComponent } from './accent-improver.component';

describe('AccentImproverComponent', () => {
  let component: AccentImproverComponent;
  let fixture: ComponentFixture<AccentImproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccentImproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccentImproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

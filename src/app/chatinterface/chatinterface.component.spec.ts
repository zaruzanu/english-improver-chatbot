import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatinterfaceComponent } from './chatinterface.component';

describe('ChatinterfaceComponent', () => {
  let component: ChatinterfaceComponent;
  let fixture: ComponentFixture<ChatinterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatinterfaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatinterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

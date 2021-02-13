import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskListComponent } from './helpdesk-list.component';

describe('HelpdeskListComponent', () => {
  let component: HelpdeskListComponent;
  let fixture: ComponentFixture<HelpdeskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutingAgencyComponent } from './executing-agency.component';

describe('ExecutingAgencyComponent', () => {
  let component: ExecutingAgencyComponent;
  let fixture: ComponentFixture<ExecutingAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutingAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutingAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

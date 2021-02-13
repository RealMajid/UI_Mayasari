import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementingAgencyComponent } from './implementing-agency.component';

describe('ImplementingAgencyComponent', () => {
  let component: ImplementingAgencyComponent;
  let fixture: ComponentFixture<ImplementingAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementingAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementingAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

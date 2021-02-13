import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpdWindowComponent } from './rpd-window.component';

describe('RpdWindowComponent', () => {
  let component: RpdWindowComponent;
  let fixture: ComponentFixture<RpdWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpdWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpdWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

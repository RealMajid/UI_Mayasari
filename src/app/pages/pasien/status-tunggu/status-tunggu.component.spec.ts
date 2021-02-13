import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTungguComponent } from './status-tunggu.component';

describe('StatusTungguComponent', () => {
  let component: StatusTungguComponent;
  let fixture: ComponentFixture<StatusTungguComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusTungguComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTungguComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

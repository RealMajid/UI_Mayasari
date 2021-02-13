import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpdComponent } from './rpd.component';

describe('RpdComponent', () => {
  let component: RpdComponent;
  let fixture: ComponentFixture<RpdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

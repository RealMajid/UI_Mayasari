import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqdocComponent } from './reqdoc.component';

describe('ReqdocComponent', () => {
  let component: ReqdocComponent;
  let fixture: ComponentFixture<ReqdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

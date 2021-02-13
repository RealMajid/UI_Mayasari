import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqdocDetailComponent } from './reqdoc-detail.component';

describe('ReqdocDetailComponent', () => {
  let component: ReqdocDetailComponent;
  let fixture: ComponentFixture<ReqdocDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqdocDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqdocDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

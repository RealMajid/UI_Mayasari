import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphComponent } from './nph.component';

describe('NphComponent', () => {
  let component: NphComponent;
  let fixture: ComponentFixture<NphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

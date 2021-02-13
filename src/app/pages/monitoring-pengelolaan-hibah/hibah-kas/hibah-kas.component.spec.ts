import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HibahKasComponent } from './hibah-kas.component';

describe('HibahKasComponent', () => {
  let component: HibahKasComponent;
  let fixture: ComponentFixture<HibahKasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HibahKasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HibahKasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

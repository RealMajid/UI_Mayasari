import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanduanComponent } from './panduan.component';

describe('PanduanComponent', () => {
  let component: PanduanComponent;
  let fixture: ComponentFixture<PanduanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanduanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanduanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

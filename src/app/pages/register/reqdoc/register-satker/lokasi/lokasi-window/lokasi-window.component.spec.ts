import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LokasiWindowComponent } from './lokasi-window.component';

describe('LokasiWindowComponent', () => {
  let component: LokasiWindowComponent;
  let fixture: ComponentFixture<LokasiWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LokasiWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LokasiWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

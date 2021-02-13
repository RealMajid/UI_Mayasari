import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DokterComponent } from './dokter.component';

describe('DokterComponent', () => {
  let component: DokterComponent;
  let fixture: ComponentFixture<DokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

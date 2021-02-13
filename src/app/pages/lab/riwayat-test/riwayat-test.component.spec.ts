import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiwayatTestComponent } from './riwayat-test.component';

describe('RiwayatTestComponent', () => {
  let component: RiwayatTestComponent;
  let fixture: ComponentFixture<RiwayatTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiwayatTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiwayatTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

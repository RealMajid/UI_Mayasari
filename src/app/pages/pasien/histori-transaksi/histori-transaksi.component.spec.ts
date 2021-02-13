import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriTransaksiComponent } from './histori-transaksi.component';

describe('HistoriTransaksiComponent', () => {
  let component: HistoriTransaksiComponent;
  let fixture: ComponentFixture<HistoriTransaksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriTransaksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriTransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

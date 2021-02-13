import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HibahBarangJasaComponent } from './hibah-barang-jasa.component';

describe('HibahBarangJasaComponent', () => {
  let component: HibahBarangJasaComponent;
  let fixture: ComponentFixture<HibahBarangJasaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HibahBarangJasaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HibahBarangJasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

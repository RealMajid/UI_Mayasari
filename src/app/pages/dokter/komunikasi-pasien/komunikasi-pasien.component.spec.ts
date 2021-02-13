import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KomunikasiPasienComponent } from './komunikasi-pasien.component';

describe('KomunikasiPasienComponent', () => {
  let component: KomunikasiPasienComponent;
  let fixture: ComponentFixture<KomunikasiPasienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomunikasiPasienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KomunikasiPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

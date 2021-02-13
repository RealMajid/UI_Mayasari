import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KonfirmasiDonorComponent } from './konfirmasi-donor.component';

describe('KonfirmasiDonorComponent', () => {
  let component: KonfirmasiDonorComponent;
  let fixture: ComponentFixture<KonfirmasiDonorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KonfirmasiDonorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KonfirmasiDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

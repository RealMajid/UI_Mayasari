import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntrianPasienComponent } from './antrian-pasien.component';

describe('AntrianPasienComponent', () => {
  let component: AntrianPasienComponent;
  let fixture: ComponentFixture<AntrianPasienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntrianPasienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntrianPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

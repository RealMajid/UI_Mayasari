import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasienDetailComponent } from './pasien-detail.component';

describe('PasienDetailComponent', () => {
  let component: PasienDetailComponent;
  let fixture: ComponentFixture<PasienDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasienDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasienDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

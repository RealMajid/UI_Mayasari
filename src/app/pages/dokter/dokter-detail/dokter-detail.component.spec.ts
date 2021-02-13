import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DokterDetailComponent } from './dokter-detail.component';

describe('DokterDetailComponent', () => {
  let component: DokterDetailComponent;
  let fixture: ComponentFixture<DokterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DokterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DokterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

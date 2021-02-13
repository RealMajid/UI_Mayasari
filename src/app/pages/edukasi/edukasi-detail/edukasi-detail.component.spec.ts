import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdukasiDetailComponent } from './edukasi-detail.component';

describe('EdukasiDetailComponent', () => {
  let component: EdukasiDetailComponent;
  let fixture: ComponentFixture<EdukasiDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdukasiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdukasiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

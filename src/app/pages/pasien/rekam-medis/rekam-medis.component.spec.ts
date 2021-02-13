import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekamMedisComponent } from './rekam-medis.component';

describe('RekamMedisComponent', () => {
  let component: RekamMedisComponent;
  let fixture: ComponentFixture<RekamMedisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekamMedisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekamMedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

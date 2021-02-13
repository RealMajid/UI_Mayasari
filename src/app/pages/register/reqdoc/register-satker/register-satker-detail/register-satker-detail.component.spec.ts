import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSatkerDetailComponent } from './register-satker-detail.component';

describe('RegisterSatkerDetailComponent', () => {
  let component: RegisterSatkerDetailComponent;
  let fixture: ComponentFixture<RegisterSatkerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSatkerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSatkerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

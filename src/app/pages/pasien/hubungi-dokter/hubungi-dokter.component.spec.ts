import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubungiDokterComponent } from './hubungi-dokter.component';

describe('HubungiDokterComponent', () => {
  let component: HubungiDokterComponent;
  let fixture: ComponentFixture<HubungiDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubungiDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubungiDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

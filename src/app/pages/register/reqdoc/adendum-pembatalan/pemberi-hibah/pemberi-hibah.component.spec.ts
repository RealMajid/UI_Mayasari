import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemberiHibahComponent } from './pemberi-hibah.component';

describe('PemberiHibahComponent', () => {
  let component: PemberiHibahComponent;
  let fixture: ComponentFixture<PemberiHibahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemberiHibahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemberiHibahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

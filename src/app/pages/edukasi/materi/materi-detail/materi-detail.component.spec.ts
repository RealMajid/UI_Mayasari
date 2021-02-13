import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriDetailComponent } from './materi-detail.component';

describe('MateriDetailComponent', () => {
  let component: MateriDetailComponent;
  let fixture: ComponentFixture<MateriDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateriDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedFilesComponent } from './related-files.component';

describe('RelatedFilesComponent', () => {
  let component: RelatedFilesComponent;
  let fixture: ComponentFixture<RelatedFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

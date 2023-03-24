import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveSampleComponent } from './archive-sample.component';

describe('ArchiveSampleComponent', () => {
  let component: ArchiveSampleComponent;
  let fixture: ComponentFixture<ArchiveSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveSampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

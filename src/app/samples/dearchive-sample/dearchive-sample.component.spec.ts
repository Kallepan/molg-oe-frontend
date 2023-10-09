import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DearchiveSampleComponent } from './dearchive-sample.component';

describe('DearchiveSampleComponent', () => {
  let component: DearchiveSampleComponent;
  let fixture: ComponentFixture<DearchiveSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DearchiveSampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DearchiveSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

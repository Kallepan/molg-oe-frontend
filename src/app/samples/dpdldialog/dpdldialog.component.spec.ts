import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPDLDialogComponent } from './dpdldialog.component';

describe('DPDLDialogComponent', () => {
  let component: DPDLDialogComponent;
  let fixture: ComponentFixture<DPDLDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DPDLDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DPDLDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

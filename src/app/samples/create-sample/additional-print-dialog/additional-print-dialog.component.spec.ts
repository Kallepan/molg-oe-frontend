import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalPrintDialogComponent } from './additional-print-dialog.component';

describe('AdditionalPrintDialogComponent', () => {
  let component: AdditionalPrintDialogComponent;
  let fixture: ComponentFixture<AdditionalPrintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalPrintDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

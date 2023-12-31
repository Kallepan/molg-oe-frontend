import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportComponent } from './export.component';
import { AppModule } from 'src/app/app.module';
import { SamplesModule } from '../../samples.module';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportComponent ],
      imports: [SamplesModule, AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

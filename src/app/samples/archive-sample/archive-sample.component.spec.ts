import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { SamplesModule } from '../samples.module';

import { ArchiveSampleComponent } from './archive-sample.component';

describe('ArchiveSampleComponent', () => {
  let component: ArchiveSampleComponent;
  let fixture: ComponentFixture<ArchiveSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, SamplesModule],
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

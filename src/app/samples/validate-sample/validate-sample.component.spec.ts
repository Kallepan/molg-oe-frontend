import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateSampleComponent } from './validate-sample.component';
import { SamplesModule } from '../samples.module';
import { AppModule } from 'src/app/app.module';

describe('ValidateSampleComponent', () => {
  let component: ValidateSampleComponent;
  let fixture: ComponentFixture<ValidateSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateSampleComponent ],
      imports: [SamplesModule, AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

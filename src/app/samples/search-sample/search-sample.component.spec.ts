import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSampleComponent } from './search-sample.component';
import { AppModule } from 'src/app/app.module';
import { SamplesModule } from '../samples.module';

describe('SearchSampleComponent', () => {
  let component: SearchSampleComponent;
  let fixture: ComponentFixture<SearchSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSampleComponent ],
      imports: [SamplesModule, AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

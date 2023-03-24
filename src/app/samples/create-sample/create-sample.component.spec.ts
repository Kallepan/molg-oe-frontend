import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSampleComponent } from './create-sample.component';

describe('CreateSampleComponent', () => {
  let component: CreateSampleComponent;
  let fixture: ComponentFixture<CreateSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';

import { AuthDialogComponent } from './auth-dialog.component';

describe('AuthDialogComponent', () => {
  let component: AuthDialogComponent;
  let fixture: ComponentFixture<AuthDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, MaterialModule],
      declarations: [ AuthDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

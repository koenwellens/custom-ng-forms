import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { Component, forwardRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'welko-duration-form-control',
  template: `
    <div></div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestDurationComponent),
      multi: true,
    },
  ],
})
export class TestDurationComponent implements ControlValueAccessor {
  writeValue(obj) {}
  registerOnChange(fn) {}
  registerOnTouched(fn) {}
}

@Component({
  selector: 'welko-name-form-control',
  template: `
    <div></div>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TestNameComponent), multi: true },
  ],
})
export class TestNameComponent implements ControlValueAccessor {
  writeValue(obj) {}
  registerOnChange(fn) {}
  registerOnTouched(fn) {}
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatInputModule, NoopAnimationsModule],
      declarations: [AppComponent, TestNameComponent, TestDurationComponent],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'custom-ng-forms'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('custom-ng-forms');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to custom-ng-forms!');
  }));
});

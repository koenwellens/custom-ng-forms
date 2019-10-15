import { Component, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatIconModule, MatInputModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DurationFormControlComponent } from './duration-form-control.component';

@Component({
  selector: 'welko-test-template-form',
  template: `
    <form #testForm="ngForm" (ngSubmit)="submit(testForm.value)">
      <welko-duration-form-control [(ngModel)]="durationModel" [ngModelOptions]="{ standalone: true }">
      </welko-duration-form-control>
    </form>
  `,
})
export class TemplateTestComponent {
  public durationModel;

  public submit(form): void {}
}

@Component({
  selector: 'welko-test-reactive-form',
  template: `
    <form [formGroup]="testForm" (ngSubmit)="submit(testForm.value)">
      <welko-duration-form-control> </welko-duration-form-control>
    </form>
  `,
})
export class ReactiveTestComponent implements OnInit {
  public durationModel;
  public testForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.testForm = this.fb.group({});
  }

  public submit(form): void {}
}

describe('DurationFormControlComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [TemplateTestComponent, ReactiveTestComponent, DurationFormControlComponent],
    }).compileComponents();
  }));

  describe('Template driven', () => {
    let fixture: ComponentFixture<TemplateTestComponent>;
    let formComponent: DurationFormControlComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TemplateTestComponent);
      formComponent = fixture.debugElement.children[0].children[0].componentInstance;
      formComponent.ngOnInit();
    });

    it('should exist', () => {
      fixture.detectChanges();
      expect(formComponent).toBeDefined();
    });

    describe('validate', () => {
      it('returns errors when start date is not filled in', () => {
        formComponent.form.get(formComponent.startDate).setValue(null);
        formComponent.form.get(formComponent.endDate).setValue(new Date());

        const errors = formComponent.validate(null);

        expect(errors).toEqual({ required: { field: 'startDate'}});
      });

      it('returns errors when end date is not filled in', () => {
        formComponent.form.get(formComponent.startDate).setValue(new Date());
        formComponent.form.get(formComponent.endDate).setValue(null);

        const errors = formComponent.validate(null);

        expect(errors).toEqual({ required: { field: 'endDate'} });
      });

      it('returns null when start and end date are filled in', () => {
        formComponent.form.get(formComponent.startDate).setValue(new Date());
        formComponent.form.get(formComponent.endDate).setValue(new Date());

        expect(formComponent.validate(null)).toBeNull();
      });
    });
  });

  describe('Reactive', () => {
    let fixture: ComponentFixture<ReactiveTestComponent>;
    let formComponent: DurationFormControlComponent;
    let accessor;
    let onTouchedSpy;
    let onChangeSpy;

    beforeEach(() => {
      fixture = TestBed.createComponent(ReactiveTestComponent);
      formComponent = fixture.debugElement.children[0].children[0].componentInstance;

      accessor = {
        onChange: () => {},
        onTouched: () => {},
      };
      onTouchedSpy = spyOn(accessor, 'onTouched');
      onChangeSpy = spyOn(accessor, 'onChange');
      formComponent.registerOnChange(accessor.onChange);
      formComponent.registerOnTouched(accessor.onTouched);
      fixture.detectChanges();
      formComponent.ngOnInit();
    });

    describe('writeValue', () => {
      it('should update the value of the formControls', () => {
        const value = { startDate: new Date(), endDate: new Date() };
        formComponent.writeValue(value);

        expect(formComponent.form.get(formComponent.startDate).value).toEqual(value.startDate);
        expect(formComponent.form.get(formComponent.endDate).value).toEqual(value.endDate);
      });
    });

    describe('valueChanged', () => {
      it('should call the onChange and onTouched callback when form is valid', () => {
        const value = { startDate: new Date(), endDate: new Date() };
        formComponent.form.get(formComponent.startDate).setValue(value.startDate);
        formComponent.form.get(formComponent.endDate).setValue(value.endDate);

        formComponent.valueChanged();

        expect(onTouchedSpy).toHaveBeenCalled();
        expect(onChangeSpy).toHaveBeenCalledWith({
          startDate: value.startDate,
          endDate: value.endDate,
        });
      });

      it('should call the onTouched and onChange callback when form is empty', () => {
        formComponent.form.get(formComponent.startDate).setValue(null);
        formComponent.form.get(formComponent.endDate).setValue(null);

        formComponent.valueChanged();

        expect(onTouchedSpy).toHaveBeenCalled();
        expect(onChangeSpy).toHaveBeenCalledWith({startDate: null, endDate: null});
      });

      it('should call the onTouched and onChange callback when form is invalid', () => {
        formComponent.form.get(formComponent.startDate).setValue(new Date());
        formComponent.form.get(formComponent.endDate).setValue(null);

        formComponent.valueChanged();

        expect(onTouchedSpy).toHaveBeenCalled();
        expect(onChangeSpy).toHaveBeenCalledWith(null);
      });
    });
  });
});

import { Component, forwardRef, OnInit, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Duration, DurationFormControlValidationErrors } from './duration-form-control.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const DURATION_FORM_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DurationFormControlComponent),
  multi: true,
};

const DURATION_FORM_CONTROL_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DurationFormControlComponent),
  multi: true,
};

@Component({
  selector: 'welko-duration-form-control',
  templateUrl: './duration-form-control.component.html',
  styleUrls: ['./duration-form-control.component.scss'],
  providers: [DURATION_FORM_CONTROL_VALUE_ACCESSOR, DURATION_FORM_CONTROL_VALIDATOR],
})
export class DurationFormControlComponent implements ControlValueAccessor, OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder) {}
  public readonly startDate = 'startDate';
  public readonly endDate = 'endDate';

  public startDateStart = new Date();
  public endDateStart = new Date(this.startDateStart).setFullYear(
    this.startDateStart.getFullYear() + 1
  );

  public form: FormGroup;

  private destroyed$ = new Subject<boolean>();
  private onChange = any => {};
  private onTouched = () => {};

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      [this.startDate]: [null],
      [this.endDate]: [null],
    });

    [this.startDate, this.endDate].forEach(field =>
      this.form
        .get(field)
        .valueChanges.pipe(takeUntil(this.destroyed$))
        .subscribe(() => this.valueChanged())
    );
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Handle value of the form when the parent sets it.
   */
  public writeValue(obj: Duration | null): void {
    const { startDate = null, endDate = null } = obj || {};

    this.form.get(this.startDate).setValue(startDate);
    this.form.get(this.endDate).setValue(endDate);

    this.onTouched();
  }

  /**
   * Learn how to call parent
   */
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Learn how to call parent
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = () => {
      // Set your own touched boolean to true so you can display errors if you want
      this.form.markAllAsTouched();
      fn();
    };
  }

  public valueChanged() {
    // Let the parent know we are touched
    this.onTouched();
    // Send value of form control back up when this form control is valid
    if (!this.validate()) {
      this.onChange({
        startDate: this.form.get(this.startDate).value,
        endDate: this.form.get(this.endDate).value,
      });
    } else {
      // Send null to parent when form control is invalid
      this.onChange(null);
    }
  }

  public validate(form: FormGroup = null): DurationFormControlValidationErrors | null {
    const startDateFormControl = this.form.get(this.startDate);
    const endDateFormControl = this.form.get(this.endDate);

    if (startDateFormControl.value || endDateFormControl.value) {
      const startDate = startDateFormControl.value;
      const endDate = endDateFormControl.value;

      if (startDate) {
        const startDateDay = startDate.toJSON().slice(0, 10);

        if (endDate) {
          const endDateDay = endDate.toJSON().slice(0, 10);

          if (startDateDay > endDateDay) {
            return {
              duration: {
                startDate: startDateDay,
                endDate: endDateDay,
              },
            };
          }
        } else {
          return this.createRequiredError('endDate');
        }
      } else {
        return this.createRequiredError('startDate');
      }
    }

    return null;
  }

  private createRequiredError(date: string) {
    return {
      required: {
        field: date,
      },
    };
  }
}

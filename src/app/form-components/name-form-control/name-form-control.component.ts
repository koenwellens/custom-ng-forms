import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup } from '@angular/forms';
import { Name, NameFormControlValidationErrors } from './name-form-control.types';
import { isEmpty } from 'lodash-es';

const NAME_FORM_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NameFormControlComponent),
  multi: true,
};

const NAME_FORM_CONTROL_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NameFormControlComponent),
  multi: true,
};

@Component({
  selector: 'welko-name-form-control',
  templateUrl: './name-form-control.component.html',
  styleUrls: ['./name-form-control.component.scss'],
  providers: [NAME_FORM_CONTROL_VALUE_ACCESSOR, NAME_FORM_CONTROL_VALIDATOR],
})
export class NameFormControlComponent implements ControlValueAccessor {
  public firstName: string;
  public lastName: string;

  public touched = false;

  private onChange = any => {};
  private onTouched = () => {};

  /**
   * Handle value of the form when the parent sets it.
   */
  public writeValue(obj: Name | null): void {
    const { firstName = null, lastName = null } = obj || {};

    this.firstName = firstName;
    this.lastName = lastName;

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
      this.touched = true;
      fn();
    };
  }

  public valueChanged() {
    // Let the parent know we are touched
    this.onTouched();
    // Send value of form control back up when this form control is valid
    if (!this.validate()) {
      this.onChange({
        firstName: this.firstName,
        lastName: this.lastName,
      });
    } else {
      // Send null to parent when form control is invalid
      this.onChange(null);
    }
  }

  public validate(form: FormGroup = null): NameFormControlValidationErrors | null {
    const result = {};

    [
      { value: this.firstName, key: 'firstName' },
      { value: this.lastName, key: 'lastName' },
    ].forEach(field => {
      if (!field.value) {
        result[field.key] = 'required';
      }
    });

    return isEmpty(result) ? null : result;
  }
}

import { FormControl } from '@angular/forms';
import { PhoneNumberValidator } from './phone-number-form-control.validators';

describe('PhoneNumberValidator', () => {

  const formControl = new FormControl();

  it('returns required error if value is null', () => {
    const result = PhoneNumberValidator(formControl);

    expect(result).toEqual({required: true});
  });

  it('returns startsWith error if value does not start with + or 0', () => {
    formControl.setValue('1234141');
    const result = PhoneNumberValidator(formControl);

    expect(result).toEqual({startswith: true});
  });

  it('returns null when value starts with +', () => {
    formControl.setValue('+1234141');
    const result = PhoneNumberValidator(formControl);

    expect(result).toBeNull();
  });

  it('returns null when value starts with 0', () => {
    formControl.setValue('01234141');
    const result = PhoneNumberValidator(formControl);

    expect(result).toBeNull();
  });
});

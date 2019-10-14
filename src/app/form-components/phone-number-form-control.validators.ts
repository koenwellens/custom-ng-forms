import { FormControl } from '@angular/forms';

export function PhoneNumberValidator(form: FormControl) {
  const { value = null } = form || {};

  if (!value) {
    return { required: true };
  }

  if (!value.startsWith('+') && !value.startsWith('0')) {
    return { startswith: true };
  }

  return null;
}

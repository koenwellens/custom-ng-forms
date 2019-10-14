import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneNumberValidator } from './form-components';

@Component({
  selector: 'welko-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public readonly title = 'custom-ng-forms';

  public readonly name = 'name';
  public readonly phoneNumber = 'phoneNumber';
  public readonly duration = 'duration';

  public otherName = {};
  public otherDuration = {};

  public form: FormGroup;

  public get formValue(): string {
    return JSON.stringify(this.form.value);
  }

  public get otherNameValue(): string {
    return JSON.stringify(this.otherName);
  }

  public get otherDurationValue(): string {
    return JSON.stringify(this.otherDuration);
  }

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit() {
    this.form = this.formBuilder.group({
      [this.name]: [null, Validators.required],
      [this.phoneNumber]: [null, [Validators.required, PhoneNumberValidator]],
      [this.duration]: [null, Validators.required],
    });
  }
}

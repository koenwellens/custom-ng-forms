import { Component, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatIconModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NameFormControlComponent } from './name-form-control.component';

@Component({
  selector: 'welko-test-template-form',
  template: `
    <form #testForm="ngForm" (ngSubmit)="submit(testForm.value)">
      <welko-name-form-control [(ngModel)]="nameModel" [ngModelOptions]="{ standalone: true }">
      </welko-name-form-control>
    </form>
  `,
})
export class TemplateTestComponent {
  public nameModel;

  public submit(form): void {}
}

@Component({
  selector: 'welko-test-reactive-form',
  template: `
    <form [formGroup]="testForm" (ngSubmit)="submit(testForm.value)">
      <welko-name-form-control> </welko-name-form-control>
    </form>
  `,
})
export class ReactiveTestComponent implements OnInit {
  public nameModel;
  public testForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.testForm = this.fb.group({});
  }

  public submit(form): void {}
}

describe('NameFormControlComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatChipsModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [TemplateTestComponent, ReactiveTestComponent, NameFormControlComponent],
    }).compileComponents();
  }));

  describe('Template driven', () => {
    let fixture: ComponentFixture<TemplateTestComponent>;
    let form: TemplateTestComponent;
    let formComponent: NameFormControlComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TemplateTestComponent);
      form = fixture.debugElement.children[0].componentInstance;
      formComponent = fixture.debugElement.children[0].children[0].componentInstance;
    });

    it('should exist', () => {
      fixture.detectChanges();
      expect(formComponent).toBeDefined();
    });

    describe('ngModel', () => {
      it('sets the value via the parent form correctly', () => {
        const name = { firstName: 'hello', lastName: 'world' };
        form.nameModel = name;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(formComponent.firstName).toBe(name.firstName);
          expect(formComponent.lastName).toBe(name.lastName);
        });
      });
    });

    describe('onChange', () => {
      it('updates the parent form correctly', () => {
        const name = { firstName: 'hello', lastName: 'world' };
        form.nameModel = {};
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          formComponent.firstName = name.firstName;
          formComponent.lastName = name.lastName;
          formComponent.valueChanged();

          expect(form.nameModel).toEqual(name);
        });
      });

      it('does not update the parent form when form control is invalid', () => {
        const name = { firstName: 'hello', lastName: 'world' };
        form.nameModel = {};
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          formComponent.firstName = name.firstName;
          formComponent.valueChanged();

          expect(form.nameModel).toBeNull();
        });
      });
    });

    describe('validate', () => {
      it('returns errors when first name is not filled in', () => {
        formComponent.firstName = null;
        formComponent.lastName = 'something';

        const errors = formComponent.validate(null);

        expect(errors).toEqual({ firstName: 'required' });
      });

      it('returns errors when last name is not filled in', () => {
        formComponent.firstName = 'something';
        formComponent.lastName = null;

        const errors = formComponent.validate(null);

        expect(errors).toEqual({ lastName: 'required' });
      });

      it('returns null when first and last name are filled in', () => {
        formComponent.firstName = 'hello';
        formComponent.lastName = 'world';

        expect(formComponent.validate(null)).toBeNull();
      });
    });
  });

  describe('Reactive', () => {
    let fixture: ComponentFixture<ReactiveTestComponent>;
    let formComponent: NameFormControlComponent;
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
    });

    describe('writeValue', () => {
      it('should update the value of the formControls', () => {
        const value = { firstName: 'hello', lastName: 'world' };
        formComponent.writeValue(value);

        expect(formComponent.firstName).toEqual(value.firstName);
        expect(formComponent.lastName).toEqual(value.lastName);
      });
    });

    describe('valueChanged', () => {
      it('should call the onChange and onTouched callback when form is valid', () => {
        const value = { firstName: 'hello', lastName: 'world' };
        formComponent.firstName = value.firstName;
        formComponent.lastName = value.lastName;

        formComponent.valueChanged();

        expect(onTouchedSpy).toHaveBeenCalled();
        expect(onChangeSpy).toHaveBeenCalledWith({
          firstName: value.firstName,
          lastName: value.lastName,
        });
      });

      it('should call the onTouched and onChange callback when form is invalid', () => {
        formComponent.firstName = null;
        formComponent.lastName = null;

        formComponent.valueChanged();

        expect(onTouchedSpy).toHaveBeenCalled();
        expect(onChangeSpy).toHaveBeenCalledWith(null);
      });
    });
  });
});

import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroupDirective, ValidationErrors } from '@angular/forms';
import { Subscription, BehaviorSubject, merge, distinctUntilChanged } from 'rxjs';
import { FORM_ERRORS } from '../../pages/auth/auth.component';

@Component({
  selector: 'controlError',
  template:`<div class="text-red-600 text-sm m-0">{{ message$ | async }}</div>`,
  styles: ``,
  imports:[AsyncPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlErrorComponent implements OnInit, OnDestroy {
  
  private subscription = new Subscription();
  private formGroupDirective = inject(FormGroupDirective);
  errors = inject(FORM_ERRORS);
  message$ = new BehaviorSubject<string>('');

  @Input() controlName!: string;
  @Input() customErrors?: ValidationErrors;

  ngOnInit(): void {
    if (this.formGroupDirective) {
      const control = this.formGroupDirective.control.get(this.controlName);

      if (control) {
        this.subscription = merge(control.valueChanges, this.formGroupDirective.ngSubmit)
          .pipe(distinctUntilChanged())
          .subscribe(() => {
            const controlErrors = control.errors;

            if (controlErrors) {
              const firstKey = Object.keys(controlErrors)[0];
              const getError = this.errors[firstKey];
              const text = this.customErrors?.[firstKey] || getError(controlErrors[firstKey]);

              this.setError(text);
            } else {
              this.setError('');
            }
          });
      } else {
        const message = this.controlName
          ? `Control "${this.controlName}" not found in the form group.`
          : `Input controlName is required`;
        console.error(message);
      }
    } else {
      console.error(`Error Component must be used within a FormGroupDirective.`);
    }
  }

  setError(text: string) {
    this.message$.next(text);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


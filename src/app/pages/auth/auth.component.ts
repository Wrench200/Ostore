import { ControlErrorComponent } from './../../Components/controlError/controlError.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIService } from '../../Services/api.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ControlErrorComponent, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'

})
export class AuthComponent implements OnInit {
  registerForm: any
  loginForm: any
  loginVisible: boolean = true;
  loader: Boolean = false
  loader2: Boolean = false
  success: Boolean = false
  successMessage: String = ''
  failedMessage: String = ''
  alertMessage: String = ''
  failed: Boolean = false
  alert: Boolean = false

  constructor(private fb: FormBuilder, private api: APIService, private auth: AuthService, private router: Router, private cart: CartService) {
    this.registerForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(12),
        Validators.pattern('^[a-zA-Z0-9]+$'),

      ]),
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(2),
      Validators.maxLength(50)]),
      email: new FormControl('', [
        Validators.required, Validators.email
      ]),
      password: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{3,30}$')]),
      password_confirm: new FormControl('', [Validators.required])




    }, {
      validator: this.checkPassword
    })
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])

    })
  }
  ngOnInit(): void {
    this.api.hide()
    this.cart.getCartItems()
  }
  checkPassword(group: FormGroup) {
    const password = group?.get('password')?.value
    const cpassword = group?.get('password_confirm')?.value
    return password === cpassword ? null : { notSame: true }
  }

  async onLogin() {
    console.log(this.loginForm.value);
    this.loader = true
    const req = await this.auth.login(this.loginForm.value).subscribe({
      next: async (res) => {
        console.log(res)
        this.auth.setSession(res)
        const add = await this.cart.loginCart()
        console.log('add');
        
  
          this.loader = false
          this.cart.getCartFromserver(this.auth.getuser())
          this.auth.getUserDetails()
        this.api.triggerReloadCart();
        if (res.data.user.role == 'ADMIN') {
          this.router.navigate(['/dashboard'])
        } else {
          
          this.router.navigate(['/home'])
        }

      },
      error: (err) => {
        console.log(err)
        this.loader = false
        this.alert = true
        this.alertMessage = 'Invalid Credentials'
        setTimeout(() => {
          this.alert = false
        }, 10000)
      }

    })

  }

  async onSignup() {
    console.log(this.registerForm.value)
    this.loader = true
    const req = await this.auth.register(this.registerForm.value).subscribe(
      {
        next: (res) => {
          this.loader = false
          this.success = true
          this.successMessage = res.message
          setTimeout(() => {
            this.success = false
          }, 5000);
          this.router.navigate(['/otp', res.data, 'verify'])
          console.log(res)
        },
        error: (err) => {
          this.loader = false
          this.failed = true
          this.failedMessage = err.message
          setTimeout(() => {
            this.failed = false
          }, 5000);
          console.error(err)
        }

      }
    );


  }

  toggleForm(): void {
    this.loginVisible = !this.loginVisible;
  }


}

const defaultErrors: {
  [key: string]: any;
} = {
  required: () => `This field is required`,
  minlength: ({ requiredLength, actualLength }: any) => `This field must be at least ${requiredLength} characters long.`,
  maxlength: ({ requiredLength, actualLength }: any) => `This field can not be more than ${requiredLength} characters .`,
  email: () => `email is invalid`,
  pattern: () => `Password must have be between 8 and 10 characters and can't contain any special characters eg'%$&_' `

};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors,
});

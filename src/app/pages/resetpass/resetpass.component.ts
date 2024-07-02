import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { ControlErrorComponent } from "../../Components/controlError/controlError.component";

@Component({
    selector: 'app-resetpass',
    standalone: true,
    templateUrl: './resetpass.component.html',
    styleUrl: './resetpass.component.scss',
    imports: [ReactiveFormsModule, CommonModule, ControlErrorComponent]
})
export class ResetpassComponent implements OnInit {
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
  data: {} ={}

  constructor(private fb: FormBuilder, private api: APIService, private auth: AuthService, private router: Router, private cart: CartService, private activeroute:ActivatedRoute) {
    this.registerForm = this.fb.group({
    
      
      password: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{8,10}$')]),
      password_confirm: new FormControl('', [Validators.required])




    }, {
      validator: this.checkPassword
    })
  }
  ngOnInit(): void {
    this.activeroute.params.subscribe(params => {
      this.data = JSON.parse( params['data'])
      console.log(this.data);
      
    })
  }
  async onSignup() {
    console.log(this.registerForm.value.password)
    const pass = {
     password:this.registerForm.value.password
    }
    const data2 = {
      ...this.data,
      ...pass
    }
    console.log(data2);
    
    this.loader = true

    const req = await this.auth.resetPassword(data2).subscribe(
      {
        next: (res) => {
          this.loader = false
          this.success = true
          this.successMessage = res.message
          setTimeout(() => {
            this.success = false
          }, 5000);
          console.log(res)
          this.router.navigate(['/auth'])
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
  checkPassword(group: FormGroup) {
    const password = group?.get('password')?.value
    const cpassword = group?.get('password_confirm')?.value
    return password === cpassword ? null : { notSame: true }
  }
}

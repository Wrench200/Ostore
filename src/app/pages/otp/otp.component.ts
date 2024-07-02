import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements OnInit {
  email: any
  otpForm: any
  error: boolean = false
  errormessage:string=''
  role: any;
  constructor(private activeroute: ActivatedRoute, private api: APIService, private router: Router, private fb: FormBuilder, private auth: AuthService) {
    this.otpForm = this.fb.group({
      code: new FormControl('', [Validators.required]),
      email: new FormControl('')
    })
  }
  ngOnInit(): void {
    this.api.hide()
    this.activeroute.params.subscribe(params => {
      this.email = params['email']
      this.role = params['role']
    })
  }
  async sendCode() {

   
    console.log(this.email);
    this.otpForm.patchValue({
      email: this.email
    })
    console.log(this.otpForm.value);
    if (this.role == 'forgot') {
      this.auth.sendforgotcode(this.otpForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/resetpass', JSON.stringify(this.otpForm.value)])
          console.log(res)
        },
        error: (err) => {
          console.log(err)  
          this.error = true
          this.errormessage = err.message
        }
      })
    }
    else {
      
      const req = await this.auth.confirmEmail(this.otpForm.value).subscribe({
        next: (res) => {
          console.log(res)
          this.router.navigate(['/auth'])
        },
        error: (err) => {
          console.log(err)
          this.error = true
          this.errormessage = err.message
        },
      })
    }

  }
}

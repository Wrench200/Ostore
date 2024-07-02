import { Component, OnInit } from '@angular/core';
import { ControlErrorComponent } from "../../Components/controlError/controlError.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';

@Component({
    selector: 'app-forgotpassword',
    standalone: true,
    templateUrl: './forgotpassword.component.html',
    styleUrl: './forgotpassword.component.scss',
    imports: [ControlErrorComponent, RouterLink, CommonModule,ReactiveFormsModule]
})
export class ForgotpasswordComponent implements OnInit{
loader: any;

    email: any
    otpForm: any
    error: boolean = false
    errormessage: string = ''
    role: any;
    constructor(private activeroute: ActivatedRoute, private api: APIService, private router: Router, private fb: FormBuilder, private auth: AuthService) {
        this.otpForm = this.fb.group({
            email: new FormControl('', [Validators.required])
        })
    }
    ngOnInit(): void {
        this.api.hide()
       
    }
    sendmail() {
        console.log(this.otpForm.value);
        
        this.auth.sendforgot(this.otpForm.value).subscribe({
            next: (res) => { 

                console.log(res);
                this.router.navigate(['/otp', res.data, 'forgot'])
            },
            error: (err) => {
             console.log(err);
                
            }
        })
        
    }
    
}
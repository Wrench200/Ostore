import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';

import { AdminService } from '../../Services/admin.service';
import { initFlowbite } from 'flowbite';
import { APIService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }
  api: string = 'http://localhost:3000'
  sidebarVisible: boolean = false;
  createForm: any
  selectedProduct: any = {
    pname: '',
    description: '',
    category: '',
    quantity: '',
    brand: '',
    images: [],
    price: ''
  }
  images: any[] = [];
  loader: Boolean = false
  loader2: Boolean = false
  success: Boolean = false
  successMessage: String = ''
  failedMessage: String = ''
  alertMessage: String = ''
  failed: Boolean = false
  alert: Boolean = false
  category: string = 'products'
  products: any[] = []
  searchForm: any
  searchQuery: string = ''
  constructor(private fb: FormBuilder, private apis:APIService, private adminService: AdminService, private router:Router, private auth: AuthService) {

    this.createForm = this.fb.group({

      pname: new FormControl('', [
        Validators.required,

      ]),
      description: new FormControl('', [
        Validators.required,

      ]),
      price: new FormControl('', [
        Validators.required,
      ]),
      quantity: new FormControl('', [
        Validators.required,
      ]),
      category: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z]/)
      ]),

      brand: new FormControl('', [
        Validators.required,
      ]),
      images: new FormControl('')

    })
    this.getall();
  
  }
  ngOnInit(): void {
   
      this.apis.hide()
  
  }
  openModal(Product: any) {
    this.selectedProduct = Product

  }
  uploadImage(event: any) {
    if (event.target.files.length > 0) {
      for (const file of event.target.files) {
        this.images.push(file);
      }
    }
  }
  changeSearch(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    // Perform actions based on the new value
    console.log('Input value changed:', newValue);
    this.search(newValue)
    if (newValue.length == 0) {
      this.getall()
    }
  }
  changeCategory(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log(value)
    this.category = value
    this.getall()
  }
  async create() {
    this.loader = true
    const req = await this.adminService.create(this.createForm.value, this.images).subscribe(
      {
        next: (res) => {
          this.loader = false
          this.success = true
          this.successMessage = res.message
          setTimeout(() => {
            this.success = false
          }, 5000);
          this.createForm.reset()
          this.images = []
          this.getall()
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

  async getall() {
    this.loader = true
    console.log(this.category)
    const req = await this.adminService.getall(this.category,'string').subscribe(
      {
        next: (res) => {
          this.loader = false
          this.products = res.data
          
          console.log(res)
        },
        error: (err) => {
          this.loader = false
          console.error(err)
        }
      }
    );
  }
  async search(query: string) {
    this.loader = true
    console.log(this.category)
    const req = await this.adminService.search(query).subscribe(
      {
        next: (res) => {
          this.loader = false
          this.products = res.data
          console.log(res)
        },
        error: (err) => {
          this.loader = false
          console.error(err)
        }
      }
    );
  }
  async delete(id: string) {
    this.loader2 = true
    const req = await this.adminService.deleteOne(id).subscribe(
      {
        next: (res) => {
          this.loader2 = false
          this.successMessage = res.message
          this.success = true
          setTimeout(() => {
            this.success = false
          }, 5000);
          this.getall()
          console.log(res)
        },
        error: (err) => {
          this.loader2 = false
          this.failedMessage = err.message
          this.failed = true
          setTimeout(() => {
            this.failed = false

          }, 5000)

          console.error(err)
        }
      }
    );
  }
  async deleteAll() {
    this.loader2 = true
    const req = await this.adminService.deleteAll().subscribe(
      {
        next: (res) => {
          this.loader2 = false
          this.successMessage = res.message
          this.success = true
          setTimeout(() => {
            this.success = false
          }, 5000);
          this.getall()
          console.log(res)
        },
        error: (err) => {
          this.loader2 = false
          this.failedMessage = err.message
          this.failed = true
          setTimeout(() => {
            this.failed = false

          }, 5000)

          console.error(err)
        }
      }
    );
  }
  signout() {
    this.auth.logout()
    this.router.navigate(['/auth'])
  }
}

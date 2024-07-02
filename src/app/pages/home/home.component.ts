import { NoopAnimationPlayer } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FooterComponent } from '../../Components/footer/footer.component';
import { NavbarComponent } from '../../Components/navbar/navbar.component';

import { APIService } from '../../Services/api.service';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products!: any[];
category:string= 'products'
  responsiveOptions: any[] | undefined;
  success: boolean = false
  successMessage: string =''

  constructor(private admin: AdminService, private api:APIService,private cart:CartService, private auth:AuthService) { }

  ngOnInit() {


      this.api.show()
    this.cart.getCartItems2()
  
      
    
    this.admin.getall(this.category,'string').subscribe(
      {
        next: (res) => {
          
          this.products = res.data

          console.log(res)
        },
        error: (err) => {
          
          console.error(err)
        }
      }
    );
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots:false,
    navSpeed: 700,
    center: true,
    margin: 3,
    autoplay: true,
    autoplayHoverPause: true,
    autoplaySpeed: 2000,
    navText: ['prev', 'next'],
    responsive: {
      0: {
        items: 1,
        dots: true
      },
      426: {
        items: 2,
        dots: true
      },
      769: {
        items: 3,
        dots:true
      },
      940: {
        items: 5,
        dots:false
      }
    },
    nav: false
  }

  getSeverity(status: any) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
    return 'Not Available'
  }
  addToCart(name: string, itemId: string, price: number, image: string, quantity: number) {
    console.log(itemId, quantity, price, image);

    this.cart.addToCart(itemId, quantity, price, image, name)


  }
  addfav(id: string) {
    this.cart.addtofav(id).subscribe({
      next: (value) => {
        this.success = true
        this.successMessage = 'Added to Favourites'
        setTimeout(() => {
          this.success = false
        }, 2000);
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
}
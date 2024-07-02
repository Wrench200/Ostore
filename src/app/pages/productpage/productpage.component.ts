import { CartService } from './../../Services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../Services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productpage',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './productpage.component.html',
  styleUrl: './productpage.component.scss'
})
export class ProductpageComponent implements OnInit {
  productId: string = ''
  product:any
  rProducts:any[]=[]
  success: boolean = false
  successMessage: string = ''
  constructor(private cart: CartService,private activeroute: ActivatedRoute, private admin: AdminService) {
    
  }
  ngOnInit(): void {
    this.activeroute.params.subscribe(params => {
      this.productId = params['id']
      console.log(this.productId);
      this.get()
    })
  }
  get() {
    this.admin.getOne(this.productId).subscribe({
      next: (res) => {
        this.product = res.data
          console.log(this.product);
        this.admin.getall(this.product.category, 'string').subscribe({
          next: (res) => {
            this.rProducts = res.data
            console.log(this.rProducts)
            },
          error: (err) => {
              console.log(err)
            }
          })
      },
      error:(err) => {
        console.log(err)
      },
    })
    
  }
  reload() {
    location.reload()
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

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../Services/admin.service';
import { APIService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  authCart!: any
  cart!: any
  private cartSubscription: Subscription = new Subscription;
  private cartSubscription2: Subscription = new Subscription
  constructor(private cartservice: CartService, public api: APIService, public auth: AuthService, private router: Router, private admin: AdminService) {
    this.cartSubscription = this.cartservice.cart$.subscribe(cart => {
      this.cart = cart
      console.log(this.cart);
      



    })

    this.cartSubscription2 = this.cartservice.cart2$.subscribe(cart => {
      this.authCart = cart[0]
      console.log(cart);
    })
  }
  remove(itemId: string) {
    console.log(itemId);

    this.cartservice.removeFromCart(itemId)

  }
  addToCart(name: string, itemId: string, price: number, image: string, quantity: number) {
    console.log(itemId, quantity, price, image);

    this.cartservice.addToCart(itemId, quantity, price, image, name)


  }
}

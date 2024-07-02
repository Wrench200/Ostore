import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent implements OnInit {
  products:any[]=[]
  cartSubscription: Subscription = new Subscription;
success: any;
successMessage: any;
  constructor(private cart: CartService) {
  
  }
  ngOnInit(): void {
    this.cart.getfav()
    this.cartSubscription = this.cart.fav$.subscribe(cart => { 

      this.products = cart
      console.log(this.products);
    })
  }
  removefav(id: string) {
    this.cart.removefav(id)
  }
  addToCart(name: string, itemId: string, price: number, image: string, quantity: number) {
    console.log(itemId, quantity, price, image);

    this.cart.addToCart(itemId, quantity, price, image, name)


  }
  
}

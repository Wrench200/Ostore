import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  api: string = 'http://localhost:3000'
  private cartKey = 'cart';
  private cartSubject = new BehaviorSubject<any>(this.getCart())
  private cartSubject2 = new BehaviorSubject<any[]>([])
  public cart2$: Observable<any[]> = this.cartSubject2.asObservable()
  public cart$ = this.cartSubject.asObservable()
  public favSubject = new BehaviorSubject<any[]>([])
  public fav$: Observable<any[]> = this.favSubject.asObservable()
  constructor(private auth: AuthService, private http: HttpClient) { }
  public getCartFromserver(userid: string) {
    return this.http.get<any>(`${this.api}/cart/getcart/${userid}`).subscribe({
      next: (res) => {
        this.cartSubject2.next(res.data)
        console.log(res)
        return res
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  // Helper method to get the cart from local storage
  private getCart(): any {



    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : { items: [], subTotal: 0 };

  }


  // Helper method to save the cart to local storage
  private saveCart(cart: any): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart))
    this.cartSubject.next(cart)
  }

  // Add to cart
  addToCart(itemid: string, quantity: number, price: number = 1, image: string = '', name: string = ''): any {

    if (this.auth.checkToken()) {
      const req = {
        itemId: itemid,
        quantity1: quantity
      }
      return this.http.post<any>(`${this.api}/cart/addtocart`, req).subscribe({
        next: (res) => {

          this.getCartFromserver(this.auth.getuser())
          console.log(res);


        },
        error: (err) => {
          console.log(err)

        }
      })
    }
    else {



      let cart = this.getCart();
      let indexFound = cart.items.findIndex((p: any) => p.itemid === itemid);

      if (indexFound !== -1) {
        cart.items[indexFound].quantity += quantity;
        cart.items[indexFound].total = cart.items[indexFound].quantity * price;
      } else {
        cart.items.push({
          name,
          image,
          itemid,
          quantity,
          price,
          total: price * quantity
        });
      }

      cart.subTotal = cart.items.reduce((acc: number, item: any) => acc + item.total, 0);
      this.saveCart(cart);
      console.log(cart);

      return cart;
    }
  }

  // Remove from cart
  removeFromCart(itemid: string): any {
    if (this.auth.checkToken()) {
      return this.http.post<any>(`${this.api}/cart/deletefromcart/${itemid}`, {}).subscribe({
        next: (res) => {


          console.log(res);
          this.getCartFromserver(this.auth.getuser())
        },
        error: (err) => {
          console.log(err)

        }
      })
    }
    else {

      let cart = this.getCart();
      let indexFound = cart.items.findIndex((p: any) => p.itemid == itemid);

      if (indexFound !== -1) {
        cart.items.splice(indexFound, 1);
        if (cart.items.length > 0) {
          cart.subTotal = cart.items.reduce((acc: number, item: any) => acc + item.total, 0);
        } else {
          cart.subTotal = 0;
        }
        this.saveCart(cart);
      }

      return cart;
    }
  }

  // Clear cart
  clearCart(): any {

    if (this.auth.checkToken()) {
      return this.http.post<any>(`${this.api}/cart/clear`, {}).subscribe({
        next: (res) => {


          console.log(res);
          this.getCartFromserver(this.auth.getuser())
        },
        error: (err) => {
          console.log(err)

        }
      })
    } else {

      localStorage.removeItem(this.cartKey);
      this.cartSubject.next({ items: [], subTotal: 0 })
    }
  }

  // Get cart items
  getCartItems(): any {
    return this.cartSubject.value
  }
  getCartItems2(): any {
    return this.cartSubject2.value
  }
  async loginCart() {
    try {

      const cart = this.getCart()
      if (cart.subTotal < 1) {
        return true
      }
      else {

        await cart.items.forEach((element: any) => {
          console.log(element.itemid, element.quantity);
          const req = {
            itemId: element.itemid,
            quantity1: element.quantity
          }
          this.http.post<any>(`${this.api}/cart/addtocart`, req).subscribe({
            next: (res) => {
              console.log(res);

            },
            error: (err) => {
              console.log(err);

            }
          })

        });
        localStorage.setItem('cart', JSON.stringify({ items: [], subTotal: 0 }))
        this.getCartFromserver(this.auth.getuser())
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }
  addtofav(id: string) {
    return this.http.get<any>(`${this.api}/products/addtofav/${id}`)
  }
  removefav(id: string) {
    return this.http.get<any>(`${this.api}/products/removefav/${id}`).subscribe({
      next: (res) => {
        console.log(res);
        this.getfav()
      },
      error: (err) => {
        console.log(err);

      },
    })
  }
  getfav() {
    return this.http.get<any>(`${this.api}/products/getfav`).subscribe({
      next: (res) => {
        this.favSubject.next(res.data)
        console.log(res)
        return res
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}

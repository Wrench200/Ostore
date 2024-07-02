import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../Services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { initDropdowns, initFlowbite, Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { Cart } from '../../interfaces/cart';
import { APIService } from '../../Services/api.service';
import { AdminService } from '../../Services/admin.service';
import { FlowbiteModule } from 'flowbite-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FlowbiteModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  authCart!: any
  cart!: any
  private cartSubscription: Subscription = new Subscription;
  private cartSubscription2: Subscription = new Subscription
  private userSubscription: Subscription = new Subscription
  loggedIn: boolean = true
  loader: boolean = false
  products: any[] = []
  user: any

  constructor(private cartservice: CartService, public api: APIService, public auth: AuthService, private router: Router, private admin: AdminService) {


    this.cartSubscription2 = this.cartservice.cart2$.subscribe(cart => {
      this.authCart = cart[0]
      console.log(cart);
    })

    this.userSubscription = this.auth.user$.subscribe(cart => {
      this.user = cart
      console.log(cart.username);
    })
    this.loader = true





    this.cartSubscription = this.cartservice.cart$.subscribe(cart => {
      this.cart = cart
      console.log(this.cart);
      this.loader = true



    })

  }
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe()
      this.cartSubscription2.unsubscribe()
      this.userSubscription.unsubscribe()
    }
  }




  async ngOnInit() {
    this.cartservice.getCartFromserver(this.auth.getuser())
    this.auth.getUserDetails()

  }
  getCart() {
    this.authCart = this.cartservice.getCartItems2()
    this.cartservice.getCartFromserver(this.auth.getuser())
    console.log(this.cart);
    console.log(this.authCart)

  }
  clearCart() {
    this.cartservice.clearCart()

  }
  remove(itemId: string) {
    console.log(itemId);

    this.cartservice.removeFromCart(itemId)

  }
  signout() {
    this.auth.logout()
    this.router.navigate(['/auth'])
  }
  async search(query: string) {
    this.loader = true

    const req = await this.admin.search(query).subscribe(
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
  changeSearch(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    // Perform actions based on the new value
    console.log('Input value changed:', newValue);
    this.search(newValue)
    if (newValue.length == 0) {
      this.products = []
    }
  }
  $modalElement = document.getElementById('small-modal')

  modalOptions: ModalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses:
      'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
    closable: true,
    onHide: () => {
      console.log('modal is hidden');
    },
    onShow: () => {
      console.log('modal is shown');
    },
    onToggle: () => {
      console.log('modal has been toggled');
    },
  };

  // instance options object
  instanceOptions: InstanceOptions = {
    id: 'small-modal',
    override: true
  };

  modal: ModalInterface = new Modal(this.$modalElement, this.modalOptions, this.instanceOptions);



  hide() {
    console.log('hide');
    this.modal.hide()

  }
}

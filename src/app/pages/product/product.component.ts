import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { APIService } from '../../Services/api.service';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { CartService } from '../../Services/cart.service';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, NavbarComponent,RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
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
  category: string = ''
  products: any[] = []
  sort: string = 'string'
  
  responsiveOptions: any[] | undefined;

  constructor(private productService: APIService, private adminService: AdminService, private activeroute: ActivatedRoute, private router: Router, private cart: CartService , private api:APIService,) { }

  ngOnInit() {
 
      this.api.show()
    
    this.activeroute.queryParams.subscribe(params => {
      this.category = params['category']
      this.getall()
    })


  }
  changeSort(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log(value)
    this.sort = value
    const queryParams: Params = { sort: `${value}` };

   
    this.getall()
  }
  changeCategory(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log(value)
    this.category = value
    const queryParams: Params = { category: `${value}` };
    
    this.router.navigate(
      [],
      {
        relativeTo: this.activeroute,
        queryParams,
        // remove to replace all query params by provided
      }
    );
    this.getall()
  }
  async getall() {
    this.loader = true
    console.log(this.category)

    const req = await this.adminService.getall(this.category,this.sort).subscribe(
      {
        next: (res) => {
          setTimeout(() =>{
            this.loader = false

          }, 1000)
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
  addToCart(name:string,itemId: string, price: number, image: string, quantity: number) {
    console.log(itemId, quantity, price, image);
    
    this.cart.addToCart(itemId, quantity, price, image, name)
   
  
  }
  show(slide: any) {
    console.log(slide);
    
  }
  addfav(id: string) {
    this.cart.addtofav(id).subscribe({
      next:(value) =>{
        this.success = true
        this.successMessage = 'Added to Favourites'
        setTimeout(() => {
          this.success = false
        }, 2000);
      },
      error:(err) => {
        console.log(err)
      },
    })
  }
}


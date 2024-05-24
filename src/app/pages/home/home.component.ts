import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { Product } from '../../Interfaces/Product';
import { APIService } from '../../Services/api.service';
import { ImportsModule } from '../../Primeng';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products!: Product[] ;

  responsiveOptions: any[] | undefined;

  constructor(private productService: APIService) { }

  ngOnInit() {
    this.productService.getProductsSmall().then((products) => {
      this.products = products;
    });

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '640px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '320px',
        numVisible: 2,
        numScroll: 1
      }
    ];
  }

  // getSeverity(status: string) {
  //   switch (status) {
  //     case 'INSTOCK':
  //       return 'success';
  //     case 'LOWSTOCK':
  //       return 'warning';
  //     case 'OUTOFSTOCK':
  //       return 'danger';
  //   }
    
  // }
}

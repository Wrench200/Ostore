import { Component, OnInit } from '@angular/core';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { Product } from '../../Interfaces/Product';
import { APIService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { NoopAnimationPlayer } from '@angular/animations';
import { FooterComponent } from '../../Components/footer/footer.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products!: Product[];

  responsiveOptions: any[] | undefined;

  constructor(private productService: APIService) { }

  ngOnInit() {
    this.productService.getProductsSmall().then((products) => {
      this.products = products;
    });

   
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots:false,
    navSpeed: 700,
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
        items: 4,
        dots:false
      }
    },
    nav: false
  }

}
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';

export const routes: Routes = [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
}, {
    path: 'home', component: HomeComponent, title: 'Ostore'
    },
    {
        path:'products', component: ProductComponent, title: 'All Products'
    }
];

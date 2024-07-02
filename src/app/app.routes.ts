import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { AuthComponent } from './pages/auth/auth.component';
import { OtpComponent } from './pages/otp/otp.component';
import { ProductpageComponent } from './pages/productpage/productpage.component';
import { AccountComponent } from './pages/account/account.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { CartComponent } from './pages/cart/cart.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { ResetpassComponent } from './pages/resetpass/resetpass.component';

export const routes: Routes = [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
}, {
    path: 'home', component: HomeComponent, title: 'Ostore'
    },
    {
        path:'products', component: ProductComponent, title: 'All Products'
    },
    {
        path:'dashboard', component: DashboardComponent, title: 'Admin'
    },
    {
        path: 'auth', component: AuthComponent, title:'Auth'
    },
    {
        path:'otp/:email/:role', component:OtpComponent, title:'OTP'
    }, {
        path:'prod/:id', component:ProductpageComponent, title:'Ostore Productpage'
    },
    {
        path:'profile', component:AccountComponent,title:'Profile'
    },
    {
        path:'favourites', component: FavouritesComponent, title:'favourites'
    },
    {
        path: 'cart', component: CartComponent, title: ' checkout'
    },
    {
        path: 'forgotpass', component:ForgotpasswordComponent, title:'Forgot Password'
    },
    {
        path:'resetpass/:data', component: ResetpassComponent, title:'Reset Password'
    },







    {
    path:'**', component: PagenotfoundComponent,title:'404'
}


];

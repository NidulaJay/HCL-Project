import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DesignComponent } from './design/design.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DesignsComponent } from './designs/designs.component';



export const routes: Routes = [

    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'design/:id',
        component: DesignComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'contact-us',
        component: ContactUsComponent
    },
    {
        path: 'designs',
        component: DesignsComponent
    }


];

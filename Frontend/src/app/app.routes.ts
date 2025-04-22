import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DesignComponent } from './design/design.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'design',
        component: DesignComponent
    }

];

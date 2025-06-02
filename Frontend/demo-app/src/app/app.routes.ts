import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent} from './login/login.component';
import { HomeComponent} from './home/home.component';
import { AuthGuard } from './auth.guard';
import { ContactComponent } from './contact/contact.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MapsComponent } from './maps/maps.component';
import { MfaComponent } from './mfa/mfa.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], 
        children: [
            {path:'contact',component:ContactComponent},
            {path:'admin',component: AdminDashboardComponent},
            {path:'maps',component: MapsComponent},
            {path:'configuremfa',component: MfaComponent},

        ] 
    },
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent}
];

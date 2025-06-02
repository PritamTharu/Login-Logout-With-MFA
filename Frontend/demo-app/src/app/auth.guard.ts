import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // You cannot directly check the HttpOnly cookie in the frontend.
    // Instead, you should call an endpoint to verify if the user is authenticated.
    
    // Here's an example where we assume the backend validates the cookie.
    return this.authService.checkSession().toPromise().then((response) => {
      if (response.isValid) { 
        return true; // If session is valid, allow access
      } else {
        this.router.navigate(['/']);
        return false; // Otherwise, redirect to login
      }
    }).catch((error) => {
      this.router.navigate(['/']);
      return false; // In case of error (session expired or other issue)
    });
  }
}
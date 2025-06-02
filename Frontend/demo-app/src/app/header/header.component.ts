import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialogModule,MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
@Component({
  selector: 'app-header',
  imports: [CommonModule,MatDialogModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  isAuthenticated: boolean = true;

  constructor(private authService: AuthService, private router: Router, private MatDialog: MatDialog) { }

  Logout() {
    this.authService.logout().subscribe(
      response => {
        this.router.navigate(['/']);
      },
      error => {
        console.log("error occured during registeration", error);
      }
    )
  }


  openProfile() {
    this.MatDialog.open(ProfileComponent,{width:'500px',height:'300px'});
  }



}

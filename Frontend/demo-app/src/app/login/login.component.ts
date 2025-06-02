import { Component , TemplateRef, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,RouterLink,MatDialogModule,MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @ViewChild('VerifyQRTemplate') VerifyQRTemplate!: TemplateRef<any>;
  
  constructor(private router: Router,private authService: AuthService, private MatDialog: MatDialog,) {}
  email: string = '';
  password: string = '';
  mfaCode!: number;
  public mfaErrorMessage: string = '';

  onSubmit(registerForm: any): void {
    if (registerForm.valid) {
      const {email,password} = registerForm.value
      this.email = email;
      this.password = password;
      this.authService.login(email,password).subscribe(
        response => {
          if(response.mfaRequired) {
            this.MatDialog.open(this.VerifyQRTemplate, {
              width: '300px'
            });
          }   
          else {
            this.router.navigate(['/home']);
            this.MatDialog.closeAll();
          }
        },
        error => {
          console.log("error occured during login",error);
        }
      )
    }
  }

  onInputChange(): void {
    this.mfaErrorMessage = '';
  }

  VerifyMfa(){
    if (!this.mfaCode) {
      return;
    }
    this.authService.login(this.email,this.password,this.mfaCode).subscribe(
      response => {       
        this.MatDialog.closeAll();
        this.router.navigate(['/home']);
      },
      error => {
        this.mfaErrorMessage = error.error?.error;
        this.mfaCode = 0
      }
    )
   }
}

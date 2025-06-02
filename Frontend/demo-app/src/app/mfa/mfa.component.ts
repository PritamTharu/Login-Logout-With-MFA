import { Component,TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mfa',
  imports: [MatDialogModule, MatIconModule,CommonModule,FormsModule],
  templateUrl: './mfa.component.html',
  styleUrl: './mfa.component.css'
})
export class MfaComponent {

  @ViewChild('VerifyQRTemplate') VerifyQRTemplate!: TemplateRef<any>;

  constructor(private router: Router, private MatDialog: MatDialog, private AuthService: AuthService) { }

  qrCodeUrl: string = '';
  secret: string = '';
  mfaCode!: number;
  public mfaErrorMessage: string = '';
  isMfaConfigured:boolean = false;
  email:string = '';

  ngAfterViewInit(){
     this.AuthService.getUserProfile().subscribe(
      response => {
        this.isMfaConfigured = response.isMfaConfigured;
        this.email = response.email;
      },
      error => {
        console.log("error in getting userProfile");
      }
     )
     
  }

  onInputChange(): void {
    this.mfaErrorMessage = '';
  }
  
  generateQR(templateRef: TemplateRef<any>){
    this.AuthService.generateTOTP(this.email).subscribe(
      response => {
        this.qrCodeUrl = response.qrCodeUrl;
        this.secret = response.secret;
        const dialogRef = this.MatDialog.open(templateRef);
      },
      error => {
        console.error('Error generating QR code:', error);
      }
    )
  }

  gotoVerifyDialouge(){
    this.mfaErrorMessage = '';
    this.MatDialog.closeAll();
    this.MatDialog.open(this.VerifyQRTemplate, {
      width: '300px'
    });
  }

  VerifyMfa(){
   if(this.mfaCode && this.secret != null){
    this.AuthService.verifyTOTP(this.email,this.mfaCode,this.secret).subscribe(
      response => {
        this.qrCodeUrl = "";
        this.secret = "";
        this.MatDialog.closeAll();
        alert("MFA added to your account")
        this.router.navigate(['/home']);
      },
      error => {
        this.qrCodeUrl = "";
        this.secret = "";
        this.mfaErrorMessage = error.error?.error;
      }
    )
   }
  }

  removeConfiguredMFA(){
    if (this.isMfaConfigured){
      this.AuthService.removeTOTP(this.email).subscribe(
        response => {
          alert("MFA removed from your account")
          this.router.navigate(['/home']);
        },
        error =>{
          alert("Something went wrong on removing MFA")
        }
      )
    }
  }






}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
RouterLink
@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router) {}
  email: string = '';
  password: string = '';

  onSubmit(registerForm: any): void {
    if (registerForm.valid) {
      const {email,password} = registerForm.value
      this.authService.register(email,password).subscribe( 
        response => {
          this.router.navigate(['/']);
        },
        error => {
          console.log("error occured during registeration",error);
        }
      )
    }
    else {
      console.log("Form is invalid");
    }
  }
}

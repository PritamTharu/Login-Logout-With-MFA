import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(public AuthService: AuthService) { }
  selectedFile: File | null = null;
  previewURL: string | ArrayBuffer | null = null;
  response: any
  avatarUrl: string | null = null;

  ngOnInit() {
    this.AuthService.getUserProfile().subscribe(
      response => {
        if (response.avatar && response.avatar.data) {
          const base64String = this.convertBufferToBase64(response.avatar.data);
          this.avatarUrl = `data:image/jpeg;base64,${base64String}`;
        }
      },
      error => {
        console.log('Error occurred while fetching user profile: ', error);
      }
    );
  }

  convertBufferToBase64(buffer: any[]): string {
    const uintArray = new Uint8Array(buffer);
    let binary = ''
    for (let i = 0; i < uintArray.length; i++) {
      binary += String.fromCharCode(uintArray[i]);
    }
    return btoa(binary);
  }


  onFileSelected(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewURL = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onFileDeselect() {
    this.selectedFile = null;
    this.previewURL = null;
    this.avatarUrl = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.AuthService.updateProfile(formData).subscribe(
        (response) => {
        },
        (error) => {
        }
      );
    }
    else {
    this.AuthService.updateProfile(null).subscribe(
      (response) => {
      },
      (error) => {
      }
    );
    }
  }



}

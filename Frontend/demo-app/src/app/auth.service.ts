import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,BehaviorSubject,of } from 'rxjs';
import { environment } from '../environments/environment.development'; 
import { catchError , switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAdminn = false;

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable(); 

  constructor(private http: HttpClient) {}


  setAdminStatus(status: boolean): void {
    this.isAdminn = status;
  }

  getAdminStatus(): boolean {
    return this.isAdminn;
  }

  checkSession(): Observable<any> {
    return this.http.get<any>(`${environment.sessionURL}`, { withCredentials: true }).pipe(
      catchError((error) => {
        return this.http.get<any>(`${environment.refreshToken}`, { withCredentials: true }).pipe(
          switchMap((refreshResponse) => {
            return this.http.get<any>(`${environment.sessionURL}`, { withCredentials: true });
          }),
          catchError((refreshError) => {
            return of({ isValid: false, message: 'Token refresh failed' });
          })
        );
      })
    );
  }

  // method used to show/hide logout/profile button in headers
  getSessionStatus(): Observable<boolean> {
    return this.checkSession().pipe(
      switchMap(response => {
        return of(response.isValid);
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    const registerData = { email, password };
    return this.http.post<any>(environment.register, registerData, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    })
  }

  login(email: string, password: string, mfaCode?: number): Observable<any> {
    const loggingData = { email, password, mfaCode };
    return this.http.post<any>(environment.login,loggingData,{
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    })
  }

  logout(){
    return this.http.post(environment.logout,{},{ withCredentials: true })
  }

  updateProfile(file:FormData|null){
    const fileData =  file;
    return this.http.put<any>(environment.updateProfile,fileData,{
      withCredentials: true,
    })
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(environment.getProfile,{ withCredentials: true});
  }

  isAdmin(){
    return this.http.get<any>(environment.isAdmin, {withCredentials:true});
  }

  generateTOTP(email:string){
    const userData = { email }
    return this.http.post<any>(environment.generateTOTP, userData, {withCredentials: true})
  }

  verifyTOTP(email:string, token:number, secret:string){
    const userData = { email, token, secret }
    return this.http.post<any>(environment.verifyTOTP, userData, {withCredentials: true})
  }

  removeTOTP(email: string) {
    return this.http.delete<any>(environment.removeTOTP, {withCredentials: true, body: { email } });
  }
  

}

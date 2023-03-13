import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  private defaultUsername: string = 'admin';
  private defaultPassword: string = 'admin';

  /**
   * Dummy login service
   * @param username 
   * @param password 
   */
  login(username: string, password: string): Observable<CommonResponse> {

    // login success
    const successRes: CommonResponse = {
      success: true,
      message: 'Logged in successfully'
    };

    // login error
    const errorRes: CommonResponse = {
      success: false,
      message: 'Invalid credentials'
    };

    return new Observable<CommonResponse>((observer) => {
      // dummy api call
      setTimeout(() => {

        if (username === this.defaultUsername && password === this.defaultPassword)
          observer.next(successRes);
        else
          observer.error(errorRes);

        observer.complete();
      }, 2000);
    });
  }

}

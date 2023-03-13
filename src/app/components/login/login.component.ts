import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isLoginLoading: boolean = false;
  usernameControl: string = 'admin';
  passwordControl: string = 'admin';

  constructor(private loginService: LoginService, private snackBar: MatSnackBar, private router: Router){}

  login(username:string, password:string){
    this.isLoginLoading = true;
    this.loginService.login(username, password).subscribe(
      (res) => {
        this.isLoginLoading = false;
        this.snackBar.open(res.message, 'close', {duration: 3000});
        this.router.navigateByUrl('/home');
      },
      (err) => {
        this.isLoginLoading = false;
        this.snackBar.open(err.message, 'close', {duration: 3000});
      },
      () => {
        this.isLoginLoading = false;
      }
    );
  }
}

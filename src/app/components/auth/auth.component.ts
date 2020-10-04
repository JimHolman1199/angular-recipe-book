import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isLogin:boolean = true;
  isLoading: boolean = false;
  error:string = null;

  constructor( private authService: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
  }

  onSwithMode(){
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return
    }

    let authObs: Observable<AuthResponseData>;

    const { email, password } = form.value
    this.isLoading = true;
    
    if(this.isLogin){
      authObs = this.authService.login(email, password)
    }else{
      authObs = this.authService.signUp(email, password)
    }

    authObs.subscribe(data=>{
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.isLoading = false;
    })

    form.reset()
  }

}

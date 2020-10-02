import { AuthService } from './../../services/auth.service';
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

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
  }

  onSwithMode(){
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return
    }

    const { email, password } = form.value
    this.isLoading = true;
    if(this.isLogin){
      
    }else{
      this.authService.signUp(email, password).subscribe(data=>{
        console.log(data)
        this.isLoading = false;
      }, errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      })
    }

    form.reset()
  }

}

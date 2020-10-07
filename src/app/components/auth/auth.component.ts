import { PlaceholderDirective } from './../shared/placeholder.directive';
import { AlertComponent } from './../alert/alert.component';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLogin:boolean = true;
  isLoading: boolean = false;
  error:string = null;
  @ViewChild(PlaceholderDirective, {static:false}) alertHost:PlaceholderDirective;
  private closeSub: Subscription;

  constructor( private authService: AuthService,
               private router: Router,
               private componentFactoryResolver: ComponentFactoryResolver ) { }

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
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    })

    form.reset()
  }

  onHandleError(){
    this.error = null;
  }

  private showErrorAlert(message: string){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(componentFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }

}

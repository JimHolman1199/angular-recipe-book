import { Subscription } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated:boolean = false;
  collapsed: boolean = true;
  
  constructor(private recipeService: RecipeService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user
    });
  }

  onSaveData(){
    this.recipeService.storeRecipes();
  }

  onFetchData(){
    this.recipeService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout()
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}

import { RecipeService } from './../recipes/recipe.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  collapsed: boolean = true;
  
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
  }

  onSaveData(){
    this.recipeService.storeRecipes();
  }

  onFetchData(){
    this.recipeService.fetchRecipes().subscribe();
  }

}

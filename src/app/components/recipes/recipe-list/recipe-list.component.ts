import { RecipeService } from './../recipe.service';
import { Recipe } from '../recipe.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recepeService: RecipeService,
              private router:Router,
              private route: ActivatedRoute) { }

  ngOnInit(){
    this.subscription = this.recepeService.recipeChanged.subscribe((recipes: Recipe[])=>{
      this.recipes = recipes;
    })
    this.recipes = this.recepeService.getRecipes()
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

}

import { RecipeService } from './recipe.service';
import { Recipe } from './../models/recipe.model';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({providedIn:'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{

    constructor(private recipeService: RecipeService){}
    
    resolve(){
        const recipes = this.recipeService.getRecipes();

        if(recipes.length === 0){
            return this.recipeService.fetchRecipes();
        } else {
            return recipes;
        }
        
    }
}
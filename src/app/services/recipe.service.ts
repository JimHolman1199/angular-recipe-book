import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ShoppingListService } from '../components/shopping-list/shopping-list.service';
import { Recipe } from '../models/recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class RecipeService {

    recipeChanged = new Subject<Recipe[]>();
    _url:string = 'https://ng-complete-guide-6da7d.firebaseio.com/recipes.json';
    private recipes: Recipe[] = [];

    // private recipes: Recipe[] = [
    //     new Recipe('A test recipe', 
    //         'This is simply a test', 
    //         'https://i1.wp.com/www.eatthis.com/wp-content/uploads/2019/10/pumpkin-pad-thai-recipe.jpg?fit=1200%2C879&ssl=1', 
    //         [
    //             new Ingredient('Meat', 1),
    //             new Ingredient('French Fries', 20)
    //         ]),
    //     new Recipe('Simple recipe', 
    //         'This is simply a test', 
    //         'https://i1.wp.com/www.eatthis.com/wp-content/uploads/2019/10/pumpkin-pad-thai-recipe.jpg?fit=1200%2C879&ssl=1', 
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Meat', 20)
    //         ])
    // ]

    constructor(private slService: ShoppingListService,
                private http: HttpClient,
                private authService: AuthService){}

    storeRecipes(){
        const recipes = this.getRecipes();
        this.http.put(this._url, recipes).subscribe((res) => {
            console.log(res)
        })
    }

    fetchRecipes(){
        return this.http.get<Recipe[]>( this._url)
            .pipe(
                map(recipes=>{
                    return recipes.map(recipe=>{
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                    })
                }),
                tap(recipes=>{
                    this.recipes = recipes;
                    this.recipeChanged.next(this.recipes.slice())
                })
            )
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipeById(id:number){
        return this.recipes[id]
    }

    addIngredientsToShoppingList(ingredients:Ingredient[]){
        this.slService.addIngredients(ingredients)
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice())
    }

    updateRecipe(index: number, newRecipe:Recipe){
       this.recipes[index] = newRecipe;
       this.recipeChanged.next(this.recipes.slice())
    }

    deleteRecipe(index:number){
        this.recipes.splice(index, 1)
        this.recipeChanged.next(this.recipes.slice());
    }
}
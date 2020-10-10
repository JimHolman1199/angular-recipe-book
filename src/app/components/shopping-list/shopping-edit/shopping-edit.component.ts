import { ShoppingListService } from './../shopping-list.service';
import { Ingredient } from '../../../models/ingredient.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static:false}) slForm: NgForm;

  subscription:Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem : Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe((index)=>{
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.slService.getIngredient(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount,
      })
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

  onSubmit(form: NgForm){
    const { name, amount } = form.value;
    const newIngredient = new Ingredient(name, amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editedItemIndex, newIngredient)
    }else{
      this.slService.addIngredient(newIngredient)
    }
    this.editMode = false;
    form.reset()
  }

  onClear(){
    this.editMode = false;
    this.slForm.reset()
  }

  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear()
  }

}

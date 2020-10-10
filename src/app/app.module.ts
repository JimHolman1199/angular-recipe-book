import { AuthModule } from './components/auth/auth.module';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { ShoppingListModule } from './components/shopping-list/shopping-list.module';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { RecipeService } from './services/recipe.service';
import { ShoppingListService } from './components/shopping-list/shopping-list.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { DropdownDirective } from './components/shared/dropdown.directive';
import { AlertComponent } from './components/alert/alert.component';
import { PlaceholderDirective } from './components/shared/placeholder.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    SpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [ShoppingListService, RecipeService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }

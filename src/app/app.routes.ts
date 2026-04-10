import { Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { AddbooksComponent } from './addbooks/addbooks.component';
import { UpdatebooksComponent } from './updatebooks/updatebooks.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth-guards';

export const routes: Routes = [
  { path: "books", component: BooksComponent, canActivate: [AuthGuard] },
  { path: "add", component: AddbooksComponent, canActivate: [AuthGuard] },
  { path: "update/:id", component: UpdatebooksComponent, canActivate: [AuthGuard] },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "**", redirectTo: "books", pathMatch: "full" },

];

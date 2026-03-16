import { Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { AddbooksComponent } from './addbooks/addbooks.component';

export const routes: Routes = [
  { path: "books", component: BooksComponent },
  { path: "add", component: AddbooksComponent },
  { path: "**", redirectTo: "books", pathMatch: "full" },

];

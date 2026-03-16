// Import Angular core features
import { Component, OnInit } from '@angular/core';

// Import Book model
import { Book } from '../book';

// Import service used to communicate with backend API
import { BookService } from '../book.service';

// Import common Angular module
import { CommonModule } from '@angular/common';

// Import HTTP client for API calls
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Import routing modules to allow navigation
import { RouterModule, Router } from '@angular/router';


@Component({
  // Component selector used in HTML
  selector: 'app-books',

  // Modules required by this standalone component
  imports: [CommonModule, HttpClientModule, RouterModule],

  // Provide BookService to this component
  providers: [BookService],

  // HTML template file for the component
  templateUrl: './books.component.html',

  // CSS styling for this component
  styleUrls: ['./books.component.css']
})


export class BooksComponent implements OnInit {

  // Page title
  title = "Book Manager";

  // Array to store books retrieved from the API
  public books: Book[] = [];

  // Book object template (not heavily used here but available if needed)
  book: Book = {
    title: '',
    author: '',
    pages: '',
    publisher: '',
  };
  
  // Variables used to store UI messages
  error = '';       // Stores error message
  success = '';     // Stores success message
  addsuccess = '';  // Stores success message after adding a book


  // Constructor injects dependencies
  constructor(
    private bookService: BookService, // Service to fetch books from backend
    private http: HttpClient,         // HTTP client for API communication
    private router: Router            // Router for navigation
  ) {
    // No additional initialization required here
  }


  // Angular lifecycle hook that runs when component initializes
  ngOnInit(): void {

    // Retrieve success message passed from another route (like Add Book page)
    this.addsuccess = history.state.addsuccess || '';

    // Call method to fetch books from API
    this.getBooks();
  }


  // Method to retrieve all books from the backend service
  getBooks(): void {

    // Call service method that returns an observable
    this.bookService.getAllBooks().subscribe(

      // Success callback
      (data: Book[]) => {

        // Store retrieved books in books array
        this.books = data;

        // Set success message
        this.success = 'Books retrieved successfully';

        // Log results to console for debugging
        console.log(this.success);
        console.log(this.books);
      },

      // Error callback
      (err) => {
        console.log(err);
      }
    );
  }

}


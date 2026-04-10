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

// Import authentication service (if needed for auth checks or user info)
import { Auth } from '../services/auth';


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
    coverImage: '',
  };
  
  // Variables used to store UI messages
  error = '';       // Stores error message
  success = '';     // Stores success message
  addsuccess = '';  // Stores success message after adding a book
  userName = ''; // Stores username for display (if needed)


  // Constructor injects dependencies
  constructor(
    private bookService: BookService, // Service to fetch books from backend
    private http: HttpClient,         // HTTP client for API communication
    private router: Router,            // Router for navigation
    public authService: Auth          // Authentication service (if needed for auth checks)
  ) {
    // No additional initialization required here
  }


  // Angular lifecycle hook that runs when component initializes
  ngOnInit(): void {
    // Get username from localStorage (if needed for display)
    this.userName = localStorage.getItem('username') || 'Guest';

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

  // Method to delete a book by its ID
  deleteBook(bookID: number): void {

    // Show a confirmation popup before deleting
    const confirmed = window.confirm("Are you sure you want to delete this book?");

    // If user clicks "Cancel", stop the function
    if (!confirmed) {
      return;
    }

    // Clear any previous success or error messages
    this.resetAlerts();

    // Call the service to delete the book from the backend API
    this.bookService.delete(bookID).subscribe({

      // Runs if the delete request is successful
      next: () => {

        // Remove the deleted book from the local array (UI update)
        // Filter keeps all books EXCEPT the one with the matching ID
        this.books = this.books.filter(
          item => item.bookID && +item.bookID != +bookID
        );

        // Display success message to the user
        this.success = "Deleted successfully";
      },

      // Runs if there is an error during the delete request
      error: err => {
        // Store the error message so it can be shown in the UI
        this.error = err.message;
      }
    });
  }


  // Method to clear alert messages
  resetAlerts(): void {

    // Clear error message
    this.error = '';

    // Clear success message
    this.success = '';
  }
}


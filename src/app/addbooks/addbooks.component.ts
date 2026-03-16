// Import Angular core functionality
import { Component, OnInit } from '@angular/core';

// Import common Angular modules
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

// Import Book model
import { Book } from '../book';

// Import service used to communicate with backend API
import { BookService } from '../book.service';

// Import HTTP client module
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Import routing tools to navigate between pages
import { RouterModule, Router } from '@angular/router';


@Component({
  // HTML selector used to include this component
  selector: 'app-addbooks',

  // Modules required by this standalone component
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],

  // HTML template file
  templateUrl: './addbooks.component.html',

  // CSS styling for this component
  styleUrls: ['./addbooks.component.css'],

  // Provides the BookService for this component
  providers: [BookService]
})

export class AddbooksComponent implements OnInit {

  // Book object bound to the form inputs
  book: Book = {
    title: '',
    author: '',
    pages: '',
    publisher: '',
  };

  // Variables used to store UI messages
  error = '';      // Stores error message if request fails
  success = '';    // Stores success message
  addsuccess = ''; // Stores message passed during navigation


  // Constructor injects dependencies
  constructor(
    private bookService: BookService,  // Service used to interact with backend API
    private http: HttpClient,          // HTTP client for API requests
    private router: Router             // Router used for page navigation
  ) {}

  // Lifecycle hook that runs when the component loads
  ngOnInit(): void {}


  // Function called when the form is submitted
  addBook(form: NgForm) {

      // Clear any previous alerts
      this.resetAlerts();

      // Call service method to send book data to the backend
      this.bookService.addBook(this.book).subscribe(

        // Success response
        (response: Book) => {

          // Display success message
          this.success = 'Successfully created!';

          // Reset the form fields
          form.resetForm();

          // Navigate to books list page and send success message
          this.router.navigate(['/books'], {
            state: { addsuccess: 'Book added successfully!' }
          });
        },

        // Error response
        (err) => {

          // Display appropriate error message
          this.error = err.error?.message || err.message ||
          'An error occurred while creating the book.';
        }
      );
  }


  // Function triggered when user clicks Cancel
  cancel(form: NgForm) {

    // Clear alert messages
    this.resetAlerts();

    // Reset form fields
    form.resetForm();

    // Navigate back to books list page
    this.router.navigate(['/books']);
  }


  // Helper function to clear alert messages
  resetAlerts() {
    this.error = '';
    this.success = '';
    this.addsuccess = '';
  }

}
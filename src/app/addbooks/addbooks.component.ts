// Import Angular core functionality (Component + lifecycle hook)
import { Component, OnInit } from '@angular/core';

// Import common Angular modules (needed for ngIf, ngFor, forms, etc.)
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

// Import Book model (defines structure of a book object)
import { Book } from '../book';

// Import service used to communicate with backend API
import { BookService } from '../book.service';

// Import HTTP client module (used for file upload requests)
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Import routing tools (used to navigate between pages)
import { RouterModule, Router } from '@angular/router';

// Import authentication service (if needed for auth checks or user info)
import { Auth } from '../services/auth';

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

  // Book object bound to the form inputs (ngModel connects form fields to this object)
  book: Book = {
    title: '',
    author: '',
    pages: '',
    publisher: '',
    coverImage: '', // will store filename of uploaded image
  };

  // Stores the actual file selected by the user
  selectedFile: File | null = null;

  // Variables used to store UI messages
  error = '';      // Stores error message if request fails
  success = '';    // Stores success message
  addsuccess = ''; // Stores message passed during navigation
  userName = ''; // Stores username for display (if needed)

  // Stores preview of the image (either existing or newly selected)
  imagePreview: string | ArrayBuffer | null = null;

  // Constructor injects dependencies
  constructor(
    private bookService: BookService,  // Handles API calls for books
    private http: HttpClient,          // Used for uploading files
    private router: Router,             // Used for page navigation
    public authService: Auth          // Authentication service (if needed for auth checks)
  ) {}

  // Lifecycle hook that runs when the component loads
  ngOnInit(): void {
    // Get username from localStorage (if needed for display)
    this.userName = localStorage.getItem('username') || 'Guest';
  }



  // ================= FILE SELECT HANDLER =================
  // Triggered when user selects a file from file input
  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    // Check if a file was selected
    if (input.files && input.files.length > 0) {

      // Store selected file for later upload
      this.selectedFile = input.files[0];

    // Create FileReader to preview image before uploading
      const reader = new FileReader();
      // When file is loaded → update preview
      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      // Convert file to base64 for preview
      reader.readAsDataURL(this.selectedFile);
    }
  }
  


  // ================= ADD BOOK FUNCTION =================
  // Called when the form is submitted
  addBook(form: NgForm) {

    // Clear previous success/error messages
    this.resetAlerts();

    // ✅ If user selected a file → upload image FIRST
    if (this.selectedFile) {

      // Create FormData object to send file to PHP
      const formData = new FormData();

      // 'image' must match $_FILES['image'] in PHP
      formData.append('image', this.selectedFile);

      // Send POST request to upload.php
      this.http.post<any>('http://localhost/BookAPI/upload.php', formData).subscribe({

        // Runs when upload is successful
        next: (res) => {
          console.log("UPLOAD RESPONSE:", res);

          // Save returned filename into book object
          // (this is what gets stored in database)
          this.book.coverImage = res.fileName;

          // Now that image is uploaded → save book info to DB
          this.saveBook(form);
        },

        // Runs if upload fails
        error: (err) => {
          console.error("Upload failed:", err);

          // Show error message to user
          this.error = err.error?.error || 'Image upload failed';
        }
      });

    } else {
      // ✅ No image selected → use default placeholder
      this.book.coverImage = 'placeholder_100.jpg';

      // Save book directly
      this.saveBook(form);
    }
  }


  // ================= SAVE BOOK TO DATABASE =================
  // This function sends book data (including image filename) to backend
  saveBook(form: NgForm) {

    this.bookService.addBook(this.book).subscribe({

      // Runs if book is successfully saved
      next: () => {

        // Show success message
        this.success = 'Successfully created!';

        // Reset form fields
        form.resetForm();

        // Navigate back to book list page
        this.router.navigate(['/books'], {
          state: { addsuccess: 'Book added successfully!' }
        });
      },

      // Runs if there is an error saving the book
      error: (err) => {

        // Display error message
        this.error = err.error?.message || err.message || 'Error creating book';
      }
    });
  }


  // ================= CANCEL FUNCTION =================
  // Called when user clicks cancel button
  cancel(form: NgForm) {

    // Clear messages
    this.resetAlerts();

    // Reset form inputs
    form.resetForm();

    // Navigate back to book list page
    this.router.navigate(['/books']);
  }


  // ================= RESET ALERTS =================
  // Clears all UI messages
  resetAlerts() {
    this.error = '';
    this.success = '';
    this.addsuccess = '';
  }





  // ================= (OPTIONAL) MANUAL UPLOAD FUNCTION =================
  // This function is NOT used anymore in your main flow,
  // but kept here for testing/debugging purposes
  uploadFile(): void {

    console.log("upload function called");

    // If no file selected → stop
    if (!this.selectedFile) {
      console.log('No file selected for upload.');
      return;
    }

    // Create FormData and attach file
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // Debug: log FormData contents
    console.log("FormData content:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Send upload request
    this.http.post<any>('http://localhost/BookAPI/upload.php', formData).subscribe(

      // Success
      response => { 
        console.log('File uploaded successfully:', response);

        // Save returned filename
        this.book.coverImage = response.fileName;
      },

      // Error
      error =>
        console.error('Error uploading file:', error)
    );
  }
}
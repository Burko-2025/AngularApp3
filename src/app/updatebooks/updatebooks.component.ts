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
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

// Import routing tools to navigate between pages
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { Auth } from '../services/auth';

@Component({
  selector: 'app-updatebooks',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './updatebooks.component.html',
  styleUrl: './updatebooks.component.css',
  // Provides the BookService for this component
  providers: [BookService]
})
export class UpdatebooksComponent implements OnInit {
  bookID: number = 0;
  // Book object bound to the form inputs
  book: Book = {
    title: '',
    author: '',
    pages: '',
    publisher: '',
    coverImage: '',
  };

  // Variables used to store UI messages
  error = '';      // Stores error message if request fails
  success = '';    // Stores success message
  addsuccess = ''; // Stores message passed during navigation
  userName = '';  // Stores username for display (if needed)

  // Store the selected image file (if user chooses a new one)
  selectedImage: File | null = null;

  // Stores preview of the image (either existing or newly selected)
  imagePreview: string | ArrayBuffer | null = null;


  // Constructor injects required services
  constructor(
    private bookService: BookService,  // Handles API calls
    private http: HttpClient,          // Used for sending HTTP requests
    private router: Router,            // Used for navigation
    private route: ActivatedRoute ,     // Used to get book ID from URL
    public authService: Auth                 // Used to check authentication status
  ) {}


  // ================= LOAD BOOK DATA =================
  ngOnInit(): void {
    // Get username from localStorage (if needed for display)
    this.userName = localStorage.getItem('username') || 'Guest';

    // Get book ID from URL (e.g., /update/5 → id = 5)
    this.bookID = + this.route.snapshot.paramMap.get('id')!;

    // Fetch book details from backend
    this.bookService.getBookByID(this.bookID).subscribe({

      next: (data: Book) => {

        // Store retrieved book data
        this.book = data;

        // If book already has an image → show it as preview
        if (this.book.coverImage) {
          this.imagePreview = 'http://localhost/BookAPI/uploads/' + this.book.coverImage;
        }
      },

      // Error handling
      error: () => {
        this.error = 'An error occurred while fetching the contact details.';
      }
    });
  }


  // ================= FILE SELECT HANDLER =================
  onFileSelected(event: any) {

    // Get selected file from input
    const file = event.target.files[0];

    if (file) {

      // Store file for upload
      this.selectedImage = file;

      // Create FileReader to preview image before uploading
      const reader = new FileReader();

      // When file is loaded → update preview
      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      // Convert file to base64 for preview
      reader.readAsDataURL(file);
    }
  }


  // ================= UPDATE BOOK =================
  updateBook(form: NgForm) {

    // Create FormData to send both text + file to PHP
    const formData = new FormData();

    // Append book data
    formData.append('bookID', this.bookID.toString());
    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('publisher', this.book.publisher);
    formData.append('pages', this.book.pages);

    // ✅ If user selected a NEW image → send it
    if (this.selectedImage) {

      // Must match $_FILES['coverImage'] in PHP
      formData.append('coverImage', this.selectedImage);

    } else {

      // ❌ No new image → keep existing one
      formData.append('existingImage', this.book.coverImage ?? '');
    }

    // Send update request to backend
    this.http.post('http://localhost/BookAPI/update.php', formData).subscribe({

      // Success response
      next: () => {

        this.success = 'Book updated successfully!';

        // Reset form
        form.resetForm();

        // Navigate back to book list
        this.router.navigate(['/books'], {
          state: { addsuccess: 'Book updated successfully!' }
        });
      },

      // Error handling
      error: (err: HttpErrorResponse) => {

        console.log("ERROR:", err); 

        // Duplicate book error
        if (err.status === 409) {
          this.error = err.error?.error || 'Duplicate title and author. Please check your data.';
        } 
        // General error
        else {
          this.error = 'An error occurred while updating the book.';
        }
      }
    });
  }


  // ================= RESET ALERTS =================
  resetAlerts() {

    // Clear all UI messages
    this.error = '';
    this.success = '';
    this.addsuccess = '';
  }
}
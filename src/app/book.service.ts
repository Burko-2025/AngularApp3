// Import Injectable so the service can be injected into components
import { Injectable } from '@angular/core';

// Import HttpClient to make HTTP requests to the backend API
import { HttpClient, HttpParams } from '@angular/common/http';

// Import map operator to transform API responses
import { map } from 'rxjs/operators';

// Import Book model
import { Book } from './book';


// Mark this class as an injectable service
// providedIn: 'root' means Angular creates a single shared instance
@Injectable({
  providedIn: 'root'
})

export class BookService {

  // Base URL for the backend API
  baseUrl = 'http://localhost/BookAPI';

  // Inject HttpClient to allow HTTP communication with the API
  constructor(private http: HttpClient) {
    // No additional initialization needed
  }


  // Method to retrieve all books from the backend
  getAllBooks() {

    // Send GET request to API endpoint /list
    return this.http.get(`${this.baseUrl}/list`).pipe(

      // Transform the response using map operator
      map((response: any) => {

        // Return only the data portion of the response
        return response.data;
      })
    );
  }


  // Method to add a new book to the database
  addBook(book: Book) {

    // Send POST request to API endpoint /add
    // The book object is wrapped inside a "data" property
    return this.http.post(`${this.baseUrl}/add`, { data: book }).pipe(

      // Transform the API response
      map((response: any) => {

        // Return the data portion of the response
        return response.data;
      })
    );
  }

}

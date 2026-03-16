// Import Angular core functionality
import { Component } from '@angular/core';

// Import RouterOutlet to allow routed components to display in this component
import { RouterOutlet } from '@angular/router';


@Component({
  // Root component selector used in index.html
  selector: 'app-root',

  // RouterOutlet allows Angular routing to render different components here
  imports: [RouterOutlet],

  // HTML template file for the root component
  templateUrl: './app.component.html',

  // CSS styling for the root component
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  // Application title displayed in the UI
  title = 'Book Manager';

}
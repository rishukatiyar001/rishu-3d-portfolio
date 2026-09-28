import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeveloperWorld } from './components/developer-world/developer-world';

@Component({
  selector: 'app-root',
  imports: [DeveloperWorld],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('rishu-3d-portfolio');
}

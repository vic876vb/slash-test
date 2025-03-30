import { Component } from '@angular/core'
import { ConcurrencyComponent } from './features/concurrency/concurrency.component'
import { PlatesComponent } from './features/plates/plates.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConcurrencyComponent, PlatesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'slash-test';
}

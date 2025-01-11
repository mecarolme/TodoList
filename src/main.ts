import { bootstrapApplication } from '@angular/platform-browser';
import { TodoComponent } from './app/todo/todo.component';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(TodoComponent, {
  providers: [provideAnimations()],
})
  .catch(err => console.error(err));

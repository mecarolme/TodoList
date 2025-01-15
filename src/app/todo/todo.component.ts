import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragStart,
  CdkDragEnd,
} from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  animations: [
    trigger('taskAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-15px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),

      transition(':leave', [
        animate(
          '500ms ease-in',
          style({ opacity: 0, transform: 'translateY(15px)' })
        ),
      ]),
    ]),
  ],
})

export class TodoComponent {
  taskInput: string = '';
  tasks: { name: string; completed: boolean; isEditing: boolean }[] = [];
  totalTasks: number = 0;
  completedTasks: number = 0;
  currentTheme = 'light';

  constructor() {
    this.loadTasks();
    this.loadTheme();
  }

  updateList() {
    this.tasks = [...this.tasks];
  }

  // To Do List
  addTask() {
    if (this.taskInput.trim()) {
      this.tasks.push({
        name: this.taskInput,
        completed: false,
        isEditing: false,
      });
      this.taskInput = '';
      this.saveTasks();
      this.updateCounters();
      this.updateList();
    }
  }

  startEditing(index: number) {
    this.tasks[index].isEditing = true;
    this.saveTasks();
  }

  saveEdit(index: number, newValue: string) {
    if (newValue.trim()) {
      this.tasks[index].name = newValue.trim();
      this.tasks[index].isEditing = false;
      this.saveTasks();
      this.updateList();
    }
  }

  cancelEdit(index: number) {
    this.tasks[index].isEditing = false;
    this.saveTasks();
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
    this.saveTasks();
    this.updateCounters();
    this.updateList();
  }

  toggleTaskCompletion(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.saveTasks();
    this.updateCounters();
    this.updateList();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    this.updateCounters();
  }

  // contador
  updateCounters() {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter((task) => task.completed).length;
  }

  // clicar e arrastar
  onDrop(event: CdkDragDrop<{ name: string; completed: boolean }[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.saveTasks();
    this.updateCounters();
  }

  onDragStarted(event: CdkDragStart) {
    const placeholder = event.source.getPlaceholderElement();
    if (placeholder) {
      placeholder.style.visibility = 'hidden';
    }
  }

  onDragEnded(event: CdkDragEnd) {
    const placeholder = event.source.getPlaceholderElement();
    if (placeholder) {
      placeholder.style.visibility = 'visible';
    }
  }

  // temas
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.currentTheme = newTheme;
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.currentTheme = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);
  }
}

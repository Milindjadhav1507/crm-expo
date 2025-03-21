import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Modal } from 'bootstrap';


interface Card {
  title: string;
  type: string;
  points: number;
  date?: string;
  image?: string;
  column: string;
}


@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent {
  todoCards: Card[] = [
    { title: 'Test and debug code for the e-commerce website checkout process', type: 'bug', points: 15, column: 'todo' },
    { title: 'Write a blog post on industry trends and best practices', type: 'issue', points: 10, date: 'Jan 25', column: 'todo' }
  ];
  doingCards: Card[] = [
    { title: 'Create wireframes for a new phoenix landing page design', type: 'bug', points: 8, date: 'Jan 25', column: 'doing' },
    { title: 'Set up and configure a new software tool for the marketing team', type: 'undefined', points: 12, date: '5/34', column: 'doing' },
    { title: 'Draft and send a press release to announce a new partnership', type: 'feature', points: 5, date: 'Jan 25', column: 'doing' },
    { title: 'Conduct a security audit of the phoenix web applications', type: 'issue', points: 20, date: 'Jan 25', image: 'https://via.placeholder.com/400/200', column: 'doing' }
  ];
  reviewCards: Card[] = [
    { title: 'Design and develop a new logo for the phoenix', type: 'issue', points: 15, column: 'review' },
    { title: 'Create a fresh visual identity for Phoenix with a new logo design', type: 'issue', points: 7, date: '5/34', column: 'review' },
    { title: 'Identify best software vendors for company-wide system through comprehensive research and evaluation', type: 'undefined', points: 18, column: 'review' },
    { title: 'Develop and deliver a training program for new employees', type: 'bug', points: 12, image: 'https://via.placeholder.com/400/200', column: 'review' }
  ];
  releaseCards: Card[] = [
    { title: 'Improve Phoenix website usability through user testing', type: 'feature', points: 15, column: 'release' },
    { title: 'Organize and lead a brainstorming session to generate new product ideas', type: 'undefined', points: 9, column: 'release' }
  ];
  draggedCard: Card | null = null;
  draggedItem: any;
  addTaskModal: Modal | undefined;

  ngOnInit(): void {
    this.addTaskModal = new Modal(document.getElementById('addTaskModal')!);
  }

  // Getters for column counts
  get todoCount(): number { return this.todoCards.length; }
  get doingCount(): number { return this.doingCards.length; }
  get reviewCount(): number { return this.reviewCards.length; }
  get releaseCount(): number { return this.releaseCards.length; }

  // Drag and Drop functions
  drag(event: DragEvent, card: Card): void {
    this.draggedCard = card;
    this.draggedItem = event.target;
    (this.draggedItem as HTMLElement).classList.add('dragging');
  }

  dragEnd(event: DragEvent): void {
    if (this.draggedItem) {
      (this.draggedItem as HTMLElement).classList.remove('dragging');
      this.draggedCard = null;
      this.draggedItem = null;
      document.querySelectorAll('.board-column').forEach(col => col.classList.remove('drag-over'));
    }
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
    const column = (event.target as HTMLElement).closest('.board-column');
    if (column) {
      column.classList.add('drag-over');
    }
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    const columnElement = (event.target as HTMLElement).closest('.board-column');

    if (columnElement && this.draggedCard) {
      const column = columnElement.getAttribute('data-column');
      if (column) {
        // Remove the card from its original array
        this.removeCardFromArray(this.draggedCard);

        // Update the card's column
        // this.draggedCard.column = column;
        this.draggedCard['column'] = column;

        // Add the card to the new column's array
        this.addCardToColumn(this.draggedCard, column);

        columnElement.classList.remove('drag-over');

      }
    }
  }
  removeCardFromArray(card: Card): void {
    switch (card.column) {
      case 'todo':
        this.todoCards = this.todoCards.filter(c => c !== card);
        break;
      case 'doing':
        this.doingCards = this.doingCards.filter(c => c !== card);
        break;
      case 'review':
        this.reviewCards = this.reviewCards.filter(c => c !== card);
        break;
      case 'release':
        this.releaseCards = this.releaseCards.filter(c => c !== card);
        break;
    }
  }

  addCardToColumn(card: Card, column: string): void {
    switch (column) {
      case 'todo':
        this.todoCards.push(card);
        break;
      case 'doing':
        this.doingCards.push(card);
        break;
      case 'review':
        this.reviewCards.push(card);
        break;
      case 'release':
        this.releaseCards.push(card);
        break;
    }
  }

  // Modal functions
  showAddTaskModal(column: string): void {
    // Store the target column in a data attribute of the form
    const taskForm = document.querySelector('#taskForm') as HTMLFormElement;
    taskForm.dataset['column'] = column;
    this.addTaskModal?.show();
  }

  addTask(form: NgForm): void {
    if (form.valid) {
      const column = (document.querySelector('#taskForm') as HTMLFormElement).dataset['column']!;
      const newTask: Card = {
        title: form.value.title,
        type: form.value.type,
        points: form.value.points,
        date: form.value.date,
        image: form.value.image,
        column: column
      };
        this.addCardToColumn(newTask, column);

      // Reset the form and close the modal
      form.reset();
        this.addTaskModal?.hide();
    }
  }
}

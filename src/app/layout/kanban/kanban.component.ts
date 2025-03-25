import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
declare var bootstrap: any;

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
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent implements OnInit {
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
  selectedColumn: string = '';
  newTask: Card = {
    title: '',
    type: 'undefined',
    points: 15,
    column: ''
  };
  editingTask: Card = {
    title: '',
    type: 'undefined',
    points: 15,
    column: ''
  };
  expandedColumns: { [key: string]: boolean } = {
    todo: true,
    doing: true,
    review: true,
    release: true
  };
  editingColumn: string | null = null;
  columnNames: { [key: string]: string } = {
    todo: 'To do',
    doing: 'Doing',
    review: 'Review',
    release: 'Release'
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize any required data
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
    this.selectedColumn = column;
    const modal = document.getElementById('addTaskModal');
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Create a new card with all required properties
      const newCard: Card = {
        title: this.newTask.title,
        type: this.newTask.type,
        points: this.newTask.points,
        date: this.newTask.date,
        image: this.newTask.image,
        column: this.selectedColumn
      };

      // Add the new card to the selected column
      this.addCardToColumn(newCard, this.selectedColumn);

      // Reset the form
      this.newTask = {
        title: '',
        type: 'undefined',
        points: 15,
        column: ''
      };

      // Close the modal
      const modal = document.getElementById('addTaskModal');
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
  }

  editTask(card: Card): void {
    this.editingTask = { ...card };
    const modal = document.getElementById('editTaskModal');
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  onEditSubmit(form: NgForm): void {
    if (form.valid) {
      // Remove the old card from its current column
      this.removeCardFromArray(this.editingTask);

      // Add the updated card to the same column
      this.addCardToColumn(this.editingTask, this.editingTask.column);

      // Reset the editing task
      this.editingTask = {
        title: '',
        type: 'undefined',
        points: 15,
        column: ''
      };

      // Close the modal
      const modal = document.getElementById('editTaskModal');
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
  }

  deleteTask(card: Card): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.removeCardFromArray(card);
    }
  }

  toggleColumn(column: string): void {
    this.expandedColumns[column] = !this.expandedColumns[column];
  }

  startEditing(column: string): void {
    this.editingColumn = column;
  }

  saveColumnName(column: string, event: any): void {
    const newName = event.target.value.trim();
    if (newName) {
      this.columnNames[column] = newName;
    }
    this.editingColumn = null;
  }

  cancelEditing(): void {
    this.editingColumn = null;
  }
}

// Add Task Dialog Component
@Component({
  selector: 'app-add-task-dialog',
  template: `
    <h2 mat-dialog-title>Add New Task</h2>
    <form #taskForm="ngForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Task Title</mat-label>
          <input matInput name="title" [(ngModel)]="task.title" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Task Type</mat-label>
          <matSelect name="type" [(ngModel)]="task.type">
            <mat-option value="bug">Bug</mat-option>
            <mat-option value="feature">Feature</mat-option>
            <mat-option value="issue">Issue</mat-option>
            <mat-option value="undefined">Undefined</mat-option>
          </matSelect>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Points</mat-label>
          <input matInput type="number" name="points" [(ngModel)]="task.points" required min="1">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date (Optional)</mat-label>
          <input matInput name="date" [(ngModel)]="task.date" placeholder="e.g., Jan 25 or 5/34">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Image URL (Optional)</mat-label>
          <input matInput name="image" [(ngModel)]="task.image" placeholder="e.g., https://via.placeholder.com/400/200">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!taskForm.valid">Add Task</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    mat-dialog-content {
      max-height: 80vh;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class AddTaskDialogComponent {
  task: Card = {
    title: '',
    type: 'undefined',
    points: 15,
    column: ''
  };

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { column: string }
  ) {
    this.task.column = data.column;
  }

  onSubmit() {
    if (this.task.title && this.task.type && this.task.points) {
      this.dialogRef.close(this.task);
    }
  }
}
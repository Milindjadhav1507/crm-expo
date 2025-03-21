import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,
    MatFormFieldModule,MatCardModule,MatSelectModule,MatInputModule,MatButtonModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
commentForm: any;
constructor(private fb:FormBuilder){
  this.commentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.maxLength(1000)]],
    ticket: ['', [Validators.required]],
    commented_by: ['', [Validators.required]]
  });

}
}

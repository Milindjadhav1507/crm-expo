import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Comment {
  id: number;
  ticketId: number;
  message: string;
  attachments: string[];
  timestamp: Date;
  userId: number;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly STORAGE_KEY = 'ticket_comments';
  private comments: Comment[] = [];
  private commentsSubject = new BehaviorSubject<Comment[]>([]);

  constructor() {
    this.loadComments();
  }

  private loadComments(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.comments = JSON.parse(stored);
      this.commentsSubject.next(this.comments);
    }
  }

  private saveComments(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.comments));
    this.commentsSubject.next(this.comments);
  }

  getCommentsForTicket(ticketId: number): Observable<Comment[]> {
    return this.commentsSubject.pipe(
      map(comments => comments.filter(comment => comment.ticketId === ticketId))
    );
  }

  addComment(comment: Omit<Comment, 'id' | 'timestamp'>): void {
    const newComment: Comment = {
      ...comment,
      id: Date.now(),
      timestamp: new Date()
    };
    this.comments.push(newComment);
    this.saveComments();
  }

  getRecentAttachments(ticketId: number): string[] {
    return this.comments
      .filter(c => c.ticketId === ticketId)
      .flatMap(c => c.attachments)
      .slice(-5); // Get last 5 attachments
  }

  // Clear comments for a specific ticket
  clearTicketComments(ticketId: number): void {
    this.comments = this.comments.filter(c => c.ticketId !== ticketId);
    this.saveComments();
  }
}

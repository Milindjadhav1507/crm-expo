import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrmApiService {
  public mainURL = "https://apicrm.esarwa.com/";
  
  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) { }

  post(url: string, data: any, options?: any): Observable<any> {
    const headers = this.getHeader();
    if (!headers) {
      console.error('No authentication headers available for POST request');
      return throwError(() => new Error('No authentication headers'));
    }
    
    return this.http.post(this.mainURL + url, data, headers).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  get(url: string, params?: any): Observable<any> {
    const headers = this.getHeader();
    if (!headers) {
      console.error('No authentication headers available for GET request');
      return throwError(() => new Error('No authentication headers'));
    }
    
    const options = {
      ...headers,
      params
    };
    
    return this.http.get(this.mainURL + url, options).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  put(url: string, data: any): Observable<any> {
    const headers = this.getHeader();
    if (!headers) {
      console.error('No authentication headers available for PUT request');
      return throwError(() => new Error('No authentication headers'));
    }
    
    return this.http.put(this.mainURL + url, data, headers).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  delete(url: string): Observable<any> {
    const headers = this.getHeader();
    if (!headers) {
      console.error('No authentication headers available for DELETE request');
      return throwError(() => new Error('No authentication headers'));
    }
    
    return this.http.delete(this.mainURL + url, headers).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Client-side or network error occurred
      console.error('Client-side error occurred:', error.error);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, body:`,
        error.error
      );

      // Log additional details for auth-related errors
      if (error.status === 401 || error.status === 403) {
        console.log('Auth error details:', {
          url: error.url,
          headers: error.headers.has('Authorization'),
          timestamp: new Date().toISOString()
        });
      }
    }

    // Let the interceptor handle the error
    return throwError(() => error);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDate(): { today: string; oneMonthAgo: string } {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return {
      today: this.formatDate(today),
      oneMonthAgo: this.formatDate(oneMonthAgo),
    };
  }

  private getHeader(): { headers: HttpHeaders; } | undefined {
    const token = this.authService.getAccessToken();
    if (!token) {
      console.warn('No access token found in API service');
      return undefined;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf8',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return { headers };
  }

  // Status related methods
  getAllStatus(): Observable<any> {
    return this.get('api/GetAllStatus/');
  }

  getStatusById(id: number): Observable<any> {
    return this.get(`api/GetStatus/${id}/`);
  }

  getLeadById(id: number): Observable<any> {
    return this.get(`api/GetLead/${id}/`);
  }

  createLead(leadData: {
    leadName: string;
    email: string;
    phone: string;
    country: string;
    state: number;
    city: string;
    leadSource: number;
    leadType: number;
    notes: string;
    status: number;
    assignedTo: number;
    attachment?: string;
    deleted?: boolean;
  }): Observable<any> {
    return this.post('api/Createlead/', leadData);
  }

  updateLead(id: number, leadData: {
    leadName: string;
    email: string;
    phone: string;
    country: string;
    state: number;
    city: string;
    leadSource: number;
    leadType: number;
    notes: string;
    status: number;
    assignedTo: number;
    attachment?: string;
    deleted?: boolean;
  }): Observable<any> {
    return this.post(`api/UpdateLead/${id}/`, leadData);
  }

  // Employee APIs
  getEmployeeList() {
    return this.get('api/get_employee/s=');
  }

  createEmployee(employeeData: any) {
    return this.post('api/employee/create/', employeeData);
  }

  getEmployeeDetail(id: number) {
    return this.get(`api/employee/detail/${id}/`);
  }

  updateEmployee(id: number, employeeData: any) {
    return this.post(`api/edit_employee/${id}/`, employeeData);
  }

  deleteEmployee(id: number) {
    return this.post(`api/employee/delete/${id}/`, {});
  }

  // Role APIs
  getRoles(keyword: string = '') {
    return this.post(`api/get_roles/s=`, {});
  }

  getRoleDetail(id: number) {
    return this.get(`api/particular_roles/${id}/`);
  }

  createRole(roleData: {
    name: string;
    description: string;
    level: number;
    Permission: any;
  }) {
    return this.post('api/create_roles/', roleData);
  }

  updateRole(id: number, roleData: {
    name?: string;
    description?: string;
    level?: number;
    Permission?: any;
  }) {
    return this.post(`api/edit_roles/${id}/`, roleData);
  }

  deleteRole(id: number) {
    return this.post(`api/delete_roles/${id}/`, {});
  }

  // Department APIs
  getDepartmentList() {
    return this.post('api/get_departments/s=', null);
  }

  getDepartmentDetail(id: number) {
    return this.get(`api/particular_departments/${id}/`);
  }

  createDepartment(departmentData: {
    name: string;
    branch: number;
  }) {
    return this.post('api/create_departments/', departmentData);
  }

  updateDepartment(id: number, departmentData: {
    name: string;
    branch: number;
  }) {
    return this.post(`api/edit_departments/${id}/`, departmentData);
  }

  deleteDepartment(id: number) {
    return this.post(`api/delete_departments/${id}/`, null);
  }

  // Branch APIs
  getBranchList() {
    return this.post('api/allbranch/s=', null);
  }
}




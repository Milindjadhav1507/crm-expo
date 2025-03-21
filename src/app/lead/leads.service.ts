import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  private leads = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', status: 'New' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', status: 'Contacted' },
    { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', phone: '345-678-9012', status: 'Qualified' },
    { id: 4, name: 'Emily White', email: 'emily.white@example.com', phone: '456-789-0123', status: 'Converted' },
    { id: 5, name: 'Chris Green', email: 'chris.green@example.com', phone: '567-890-1234', status: 'New' },
  ];

  // Get all leads
  getAllLeads() {
    return this.leads;
  }

  // Add a new lead
  addLead(lead: any) {
    const newId = this.leads.length + 1;
    lead.id = newId;
    this.leads.push(lead);
  }

  // Delete a lead
  deleteLead(id: number) {
    this.leads = this.leads.filter(lead => lead.id !== id);
  }

  // Update an existing lead
  updateLead(updatedLead: any) {
    const index = this.leads.findIndex(lead => lead.id === updatedLead.id);
    if (index !== -1) {
      this.leads[index] = updatedLead;
    }
  }
}

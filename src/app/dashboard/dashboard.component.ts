import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgClass } from '@angular/common';
import { MatListModule } from '@angular/material/list';
// import { NgChartsModule } from 'ng2-charts';
import { BaseChartDirective  } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ElementRef } from '@angular/core';
import { CrmApiService } from '../crm-api.service';
import * as echarts from 'echarts';
import { CreateLeadComponent } from '../lead/create-lead/create-lead.component';
import { MatDialog } from '@angular/material/dialog';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

interface RecentSale {
  name: string;
  time: string;
  amount: string;
  image: string
}

interface TableData {
  name: string;
  item: string;
  date: string;
  stats: 'Succes' | 'Failure';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatTableModule, MatProgressBarModule,MatListModule,CommonModule,
  MatIconModule, MatBadgeModule, MatButtonModule,
  MatIconModule, MatButtonModule, MatSelectModule,
  MatTableModule, MatMenuModule, MatProgressSpinnerModule, NgxEchartsModule,
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import('echarts'),
      },
    },
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('barCanvas', { static: false }) barCanvas!: ElementRef;
  private canvasContext: CanvasRenderingContext2D | null = null;
  displayedColumns: string[] = [
    // 'index',
    'created_at',
    'leadName',
    'email',
    'phone',
    // 'country',
    // 'state',
    // 'city',
    'leadSourceName',
    // 'leadType_id',
    // 'notes',
    'status_id',
    'assignedTo_id',
    'actions',
  ];


  dataSource: any

  doughnutPercentage = 40;
  cards: {
    title: string; value: any; progress: number; // Example progress value, replace with actual logic
    progressColor: string; // Replace with dynamic logic if needed
    backgroundColor?: string; // Optional background color property
    vs: string;
  }[] | undefined;
  lineChart1: any;
  dognutChart: any = {
    data: {
      datasets: [{
        data: []
      }]
    }
  };

constructor(private api: CrmApiService,private dialog :MatDialog) {
  // Chart.register(...registerables);
}
public barChartLabels: string[] = [];
public barChartOptions: any
ngOnInit(): void {
  // crm/previous_leads/
  this.getLeads()
  this.fetchChartData()
  this.fetchDashboardData()
this.fetchpermission()
}
fetchpermission(){
  // /crm/permissions/1/1
  this.api.get(`auth/employee_permissions/`, null).subscribe((res: any) => {
    console.log(res)
    // Add logic to handle permission response
  })
}
getLeads() {
  // /crm/GetAllLead/s=a
  this.api.post('api/GetAllLead/s=', null).subscribe((res: any) => {
    console.log(res)
    this.dataSource = new MatTableDataSource(res.data)
  })
}
 editLead(lead: any) {
    console.log('Edit Lead:', lead);
    // /crm/UpdateLead
    this.api.get(`api/GetLead/${lead.id}`, null).subscribe((res: any) => {
      console.log(res)
      const dialogRef = this.dialog.open(CreateLeadComponent, {
        data: { leadF: res.data }, // Pass data to the dialog
        disableClose: true, // Makes the backdrop static and disables keyboard close
        width: '600px', // Optional: Adjust dialog width
      });

      dialogRef.afterClosed().subscribe(
        (result: any) => {
          console.log('Dialog closed with result:', result);
          this.getLeads();
        },
        (reason: any) => {
          console.log('Dialog dismissed with reason:', reason);
          this.getLeads();
        }
      );

    })

  }

  // Function to delete lead
  deleteLead(id: number) {
    if (confirm('Are you sure you want to delete this lead?')) {
      // /crm/DeleteLead/1
      this.api.get(`api/DeleteLead/${id}`, null).subscribe((res: any) => {
        if (res.status == 200) {
          console.log(res)
          this.getLeads()
          // this.toast.success({ detail: 'Lead deleted successfully' });
        }
      })
    }
  }
fetchChartData() {
  // Dummy data for weekly leads
  const dummyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [45, 52, 38, 64, 58, 50, 45]
  };

  this.lineChart1 = {
    color: ['#50a5f1'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: dummyData.labels,
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        },
        axisLine: {
          show: false
        },
      },
    ],
    yAxis: [{
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    }],
    series: [{
      name: 'Leads',
      type: 'bar',
      barWidth: '30%',
      data: dummyData.data,
      itemStyle: {
        color: '#50a5f1'
      }
    }]
  };
}

fetchDashboardData() {
  this.api.get('api/dashboard/', null).subscribe(
    (res: any) => {
      const data = res.data;
      const chartDom = document.getElementById('doughnutChart')!;
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: 'Leads Overview',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Total Leads', 'Today\'s Lead', 'Total Open Leads', 'Total Closed Leads']
        }, 
        series: [
          {
            name: 'Leads Data',
            type: 'pie',
            radius: ['50%', '70%'], // Inner and outer radius for doughnut chart
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: data.Total_leads, name: 'Total Leads' },
              { value: data.Today_lead, name: 'Today\'s Lead' },
              { value: data.Total_open_lead, name: 'Total Open Leads' },
              { value: data.Total_close_lead, name: 'Total Closed Leads' }
            ]
          }
        ]
      };

      // Set the option and render the chart
      myChart.setOption(option);

      // Make the chart responsive
      window.addEventListener('resize', () => {
        myChart.resize();
      });


      // const dognutChart = {
      //   data: {
      //     datasets: [{
      //       data: []
      //     }]
      //   }
      // };
      // this.dognutChart.data.datasets[0].data = [data.Total_leads, data.Today_lead, data.Total_open_lead, data.Total_close_lead];
      // this.doughnutPercentage = ;
      // Populate cards array with the fetched data
      this.cards = [
        {
          title: 'Total Leads',
          value: data.Total_leads,
          progress: 10, // Example progress value, replace with actual logic
          progressColor: 'green', // Replace with dynamic logic if needed
          vs: 'vs last week',
          backgroundColor: '#e3f2fd' // Light blue
        },
        {
          title: 'Today Leads',
          value: data.Today_lead,
          progress: 5, // Example progress value
          progressColor: 'green',
          vs: 'vs yesterday',
          backgroundColor: '#e8f5e9' // Light green
        },
        {
          title: 'Total Open Leads',
          value: data.Total_open_lead,
          progress: -3, // Example progress value
          progressColor: 'red',
          vs: 'vs last month',
          backgroundColor: '#fffde7' // Light yellow
        },
        {
          title: 'Total Closed Leads',
          value: data.Total_close_lead,
          progress: 0, // Example progress value
          progressColor: 'green',
          vs: 'vs last year',
          backgroundColor: '#ffebee' // Light red
        },
      ];
    },
    (error) => {
      console.error('Error fetching dashboard data', error);
    }
  );
}

onMonthChange(selectedMonth: string) {
  // Optionally modify the dataset based on the selected month
  console.log(`Selected month: ${selectedMonth}`);
}

ngAfterViewInit(): void {
  if (this.barCanvas) {
    this.canvasContext = this.barCanvas.nativeElement.getContext('2d');
    // this.drawBarChart();
  }
}



getBadgeColor(status: any): any {
  switch (status) {
    case 'Success':
      return 'primary';
    case 'Failed':
      return 'mat-warn';
    default:
      return 'default';
  }
}
}

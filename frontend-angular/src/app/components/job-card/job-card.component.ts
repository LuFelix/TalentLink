import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
})
export class JobCardComponent {
  @Input() job: any = {};
  //{
  //   title: string;
  //   company: string;
  //   location: string;
  //   type: string;
  // };
  constructor() {
    // Inicialização quando necessária
  }
}

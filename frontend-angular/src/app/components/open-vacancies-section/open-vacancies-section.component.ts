import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCardComponent } from '../job-card/job-card.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-open-vacancies-section',
  standalone: true,
  imports: [CommonModule, JobCardComponent, MatButtonModule],
  templateUrl: './open-vacancies-section.component.html',
  styleUrl: './open-vacancies-section.component.scss',
})
export class OpenVacanciesSectionComponent {
  jobs = [
    {
      title: 'Desenvolvedor Frontend',
      company: 'Tech Solutions',
      location: 'Remoto',
      type: 'Full-time',
    },
    {
      title: 'UX/UI Designer',
      company: 'Creative Minds',
      location: 'São Paulo, SP',
      type: 'Part-time',
    },
    {
      title: 'Engenheiro de Dados',
      company: 'Data Insights',
      location: 'Maceió, AL',
      type: 'Full-time',
    },
  ];
}

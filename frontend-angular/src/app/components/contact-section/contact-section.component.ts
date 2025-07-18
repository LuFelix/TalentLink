import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router'; // Para rota de login em logout
import { constructorChecks } from '@angular/cdk/schematics';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout(); // Chama o método logout do serviço
  }
}

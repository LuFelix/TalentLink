import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth/auth.service'; // Importe AuthService e UserData
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; // Para routerLink
import { UserData } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule, // Para o botão de ir para Admin
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: UserData | null = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Inscreve-se no Observable do usuário logado para obter seus dados
    this.authService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAdmin = this.authService.hasRole('admin'); // Verifica se é admin
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

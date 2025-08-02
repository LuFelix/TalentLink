import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; // Para ngIf
import { RouterModule } from '@angular/router'; // Para routerLink
import { AuthService } from '../../auth/auth.service'; // <-- Importe o AuthService
import { Observable, Subscription } from 'rxjs'; // Para usar Observables
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  isAuthenticated$: Observable<boolean>;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$; // Conectão do observable do AuthService
  }

  ngOnInit(): void {}

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }
  openNotifications(): void {
    console.log('Abrir notificações.');
    // Implemente a lógica para abrir um modal de notificações ou navegar para uma página de notificações
    // Exemplo: this.router.navigate(['/notifications']);
  }
  logout(): void {
    console.log('Logout acionado do header principal.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}

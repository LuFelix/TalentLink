import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; // Para ngIf
import { RouterModule } from '@angular/router'; // Para routerLink
import { AuthService } from '../../auth/auth.service'; // <-- Importe o AuthService
import { Observable } from 'rxjs'; // Para usar Observables

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  } // <-- Injete o AuthService

  ngOnInit(): void {}

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  logout(): void {
    this.authService.logout(); // Chama o logout do serviço
  }
}

import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Para diretivas como *ngIf, *ngFor
import { RouterModule } from '@angular/router'; // Para router-outlet e routerLink

// Angular Material Imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/auth.service'; // Para logout e talvez user info
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { MediaMatcher } from '@angular/cdk/layout'; // Importe MediaMatcher
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Importe RouterModule para o <router-outlet>
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentAdminPageTitle: string = 'Dashboard';

  mobileQuery: MediaQueryList;
  @ViewChild('sidenav') sidenav!: MatSidenav; // Referência à sua sidenav
  private _mobileQueryListener: () => void;
  sidenavWidth: number = 250;
  collapsedSidenavWidth: number = 64;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)'); // Define o breakpoint mobile
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); // Adiciona listener
  }

  logout(): void {
    this.authService.logout();
  }
  ngOnInit(): void {
    // Exemplo: Atualizar o título baseado na rota
    this.router.events
      .pipe(
        // Filtra apenas eventos de NavigationEnd para garantir que a navegação terminou
        filter((event) => event instanceof NavigationEnd),
        // Mapeia para a rota ativa mais profunda
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        // Filtra rotas sem dados (como o próprio layout)
        filter((route) => route.outlet === 'primary'),
        // Mapeia para os dados da rota (onde o título pode ser definido)
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        // Se a rota tiver um 'title' ou 'pageTitle' definido, use-o
        if (data['title']) {
          this.currentAdminPageTitle = data['title'];
        } else if (data['pageTitle']) {
          // Exemplo de outra chave
          this.currentAdminPageTitle = data['pageTitle'];
        } else {
          this.currentAdminPageTitle = 'Admin Page'; // Título genérico se não encontrar
        }
      });
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener); // Remove listener ao destruir
  }
  /**
   * Método para alternar o estado da sidenav (abrir/fechar) e ajustar sua largura em desktop.
   */
  toggleSidenav(): void {
    if (this.mobileQuery.matches) {
      // Em mobile, simplesmente alterna o estado (abrir/fechar overlay)
      this.sidenav.toggle();
    } else {
      // Em desktop, alterna o estado E ajusta a largura para o efeito de recolhimento
      // `.then()` garante que a largura seja atualizada APÓS a animação de toggle iniciar
      this.sidenav.toggle().then(() => {
        // Atualiza a largura para o CSS (para a transição visual)
        this.sidenavWidth = this.sidenav.opened
          ? 250
          : this.collapsedSidenavWidth;
      });
    }
  }
}

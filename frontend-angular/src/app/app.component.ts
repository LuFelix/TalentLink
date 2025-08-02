import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component'; // Importe o HeaderComponent
import { FooterComponent } from './components/footer/footer.component'; // Importe o FooterComponent
import { HomeComponent } from './pages/home/home.component'; // Importe o HomeComponent
// Importe MatSidenavModule
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TestFooterComponent } from './test/test-footer/test-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    TestFooterComponent,
    HomeComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TalentLink';
  isLandingPageRoute: boolean = true;
  private routerSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Observa os eventos de navegação para determinar se estamos em uma rota de landing page
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild; // Navega até a rota mais "profunda"
          return route;
        }),
        filter((route) => route.outlet === 'primary'), // Garante que é a rota primária
        map((route) => {
          // Verifica se a rota atual tem 'isLandingPage: true' em seus dados.
          // Se não tiver, ou se tiver 'isAppRoute: true', assumimos que não é landing page.
          return route.snapshot.data['isLandingPage'] === true;
        })
      )
      .subscribe((isLandingPage: boolean) => {
        this.isLandingPageRoute = isLandingPage;
        console.log('Current route is Landing Page:', this.isLandingPageRoute);
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}

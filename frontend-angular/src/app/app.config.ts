import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

// Definição de rotas
const routes: Routes = [
  { path: '', component: HomeComponent }, // Rota principal dá Landing Page (HomeComponent)
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: '', // Rota PARENT. Pode ser vazia ou ter um segmento como 'app'
    canActivate: [AuthGuard], // <-- Aplica o AuthGuard a esta rota
    children: [
      // Rotas FILHAS herdam a proteção do pai
      { path: 'profile', component: ProfileComponent },
      //{ path: 'settings', component: SettingsComponent },
      //{ path: 'dashboard', component: DashboardComponent },
      // ... outras rotas que exigem autenticação
    ],
  },
  // { path: '**', redirectTo: '' } // Opcional: redirecionar rotas não encontradas
];
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Fornece o roteador com rotas definidas
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};

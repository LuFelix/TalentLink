import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
// Componentes de rota
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { RegisterComponent } from './auth/register/register.component'; // Importe seu RegisterComponent
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component'; // Importe seu AdminLayoutComponent
import { UserListComponent } from './admin/users/user-list/user-list.component'; // Importe seu UserListComponent
import { RoleGuard } from './auth/guards/role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Definição de rotas
const routes: Routes = [
  { path: '', component: HomeComponent }, // Rota principal dá Landing Page (HomeComponent)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard', // Nova rota para o dashboard
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protege o dashboard com AuthGuard
  },

  {
    path: 'admin', // Rota PARENT para a área administrativa
    component: AdminLayoutComponent, // O layout administrativo será o componente pai
    canActivate: [AuthGuard, RoleGuard], // Aplica AuthGuard E RoleGuard
    data: { roles: ['admin'] }, // Passa a role necessária para o RoleGuard
    children: [
      // Rotas FILHAS herdam a proteção do pai
      { path: 'users', component: UserListComponent },
      // { path: 'settings', component: SettingsComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
      // { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'manager'] } },
      { path: '', redirectTo: 'users', pathMatch: 'full' }, // Redireciona para gestão de usuários por padrão
      //{ path: 'settings', component: SettingsComponent },
      //{ path: 'dashboard', component: DashboardComponent },
      // ... outras rotas que exigem autenticação
    ],
  },
  { path: '**', redirectTo: '' }, // Opcional: redirecionar rotas não encontradas
];
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Fornece o roteador com rotas definidas
    provideHttpClient(withInterceptorsFromDi()), // Habilita o uso de interceptors fornecidos via DI
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Permite que múltiplos interceptors sejam registrados
    },
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
};

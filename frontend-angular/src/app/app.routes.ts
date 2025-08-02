// src/app/app.routes.ts

import { Routes } from '@angular/router';

// Importe todos os seus componentes de rota aqui
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

// Importe seus Guards
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';

// Definição das rotas
export const routes: Routes = [
  // Rotas da Landing Page (públicas)
  { path: '', component: HomeComponent, data: { isLandingPage: true } },
  { path: 'login', component: LoginComponent, data: { isLandingPage: true } },
  {
    path: 'register',
    component: RegisterComponent,
    data: { isLandingPage: true },
  },

  // Rotas da Área Autenticada (privadas)
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // Rotas da Área Administrativa (protegidas por AuthGuard e RoleGuard)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        data: { title: 'Dashboard Administrativo' },
      },
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },

  // Rota curinga para qualquer URL não encontrada
  { path: '**', redirectTo: '' },
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor
import { MatTableModule } from '@angular/material/table'; // Para a tabela
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog'; // Para o diálogo de confirmação
import { MatSnackBar } from '@angular/material/snack-bar'; // Para notificações
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component'; // Caminho para o seu ConfirmDialogComponent
import { HttpClient } from '@angular/common/http'; // Para fazer chamadas HTTP
import { AuthService } from '../../../auth/auth.service'; // Para pegar o token ou verificar roles
import { MatCardModule } from '@angular/material/card'; // Para mat-card, mat-card-header, mat-card-content, mat-card-title
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para mat-spinner

export interface ApiResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface User {
  id: number;
  email: string;
  roles: string[];
  createdAt: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    // Note: MatDialogModule é fornecido no app.config.ts, mas o MatDialog (o serviço) é injetado.
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'roles', 'actions'];
  users: User[] = [];
  isLoading = false;
  private apiUrl = 'https://talentlink.local/api/users'; // <<< URL para seu endpoint de usuários no backend

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(
      'UserListComponent ngOnInit chamado. Tentando carregar usuários...'
    );
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('loadUsers() chamado. Disparando GET para:', this.apiUrl);
    this.isLoading = true;
    // Opcional: Adicionar um interceptor para anexar o token automaticamente
    // Por enquanto, faremos uma chamada direta
    this.http.get<ApiResponse>(this.apiUrl).subscribe({
      next: (response) => {
        this.users = response.data;
        console.log('Dados de usuários recebidos:', response);
        console.log(
          'Users array populado, length:',
          this.users.length,
          'data type:',
          typeof this.users
        ); // Novo log
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar usuários.', 'Fechar', {
          duration: 3000,
        });
        console.error('Erro ao carregar usuários:', err);
        this.isLoading = false;
      },
    });
  }

  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o usuário ${user.email}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(userId: number): void {
    this.http.delete(`${this.apiUrl}/${userId}`).subscribe({
      next: () => {
        this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.loadUsers(); // Recarrega a lista
      },
      error: (err) => {
        this.snackBar.open('Erro ao excluir usuário.', 'Fechar', {
          duration: 3000,
        });
        console.error('Erro ao excluir usuário:', err);
      },
    });
  }
}

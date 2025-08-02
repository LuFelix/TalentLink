// src/app/admin/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select'; // Para selecionar roles
import { MatCheckboxModule } from '@angular/material/checkbox'; // Para isActive
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Interfaces (pode copiar do user-list.component.ts ou ter um arquivo shared/interfaces.ts)
export interface User {
  id?: number; // Opcional para criação
  email: string;
  roles: string[];
  isActive?: boolean; // Opcional, pode ser padrão true no backend
  password?: string; // Necessário para criação, opcional para edição
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;
  isEditMode = false;
  isLoading = false;
  allRoles: string[] = ['admin', 'user']; // Defina os roles disponíveis no seu sistema

  private apiUrl = 'https://talentlink.local/api/users'; // URL base para gerenciar usuários

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    // Inicializa o formulário com validações
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // A senha é obrigatória APENAS no modo de criação
      password: ['', [Validators.minLength(6)]],
      roles: [[], Validators.required], // Array de strings
      isActive: [true], // Campo booleano, padrão true
    });
  }

  ngOnInit(): void {
    // Verifica se estamos em modo de edição
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id; // Converte string para number
        this.isEditMode = true;
        this.loadUser(this.userId);
        // Remove a validação 'required' para a senha em modo de edição
        this.userForm.get('password')?.setValidators(null);
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        // Modo de criação, a senha é obrigatória
        this.userForm
          .get('password')
          ?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  /**
   * Carrega os dados do usuário para edição.
   */
  loadUser(id: number): void {
    this.isLoading = true;
    this.http.get<User>(`${this.apiUrl}/${id}`).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          email: user.email,
          // Não preenche a senha por segurança
          roles: user.roles,
          isActive: user.isActive,
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar dados do usuário.', 'Fechar', {
          duration: 3000,
        });
        console.error('Erro ao carregar usuário:', err);
        this.isLoading = false;
        this.router.navigate(['/admin/users']); // Volta para a lista se o usuário não for encontrado
      },
    });
  }

  /**
   * Envia o formulário para criar ou atualizar o usuário.
   */
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
      this.snackBar.open(
        'Por favor, preencha todos os campos obrigatórios corretamente.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    this.isLoading = true;
    const userData = this.userForm.value;

    if (this.isEditMode) {
      // Remover a senha se não foi alterada (para não enviar senha vazia)
      if (!userData.password) {
        delete userData.password;
      }
      this.http.patch(`${this.apiUrl}/${this.userId}`, userData).subscribe({
        next: () => {
          this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao atualizar usuário.', 'Fechar', {
            duration: 3000,
          });
          console.error('Erro ao atualizar usuário:', err);
          this.isLoading = false;
        },
      });
    } else {
      // POST para criar usuário
      // Lembre-se que o backend espera 'api/users/register' para admin
      this.http.post(`${this.apiUrl}/register`, userData).subscribe({
        // <--- URL específica para registro via admin
        next: () => {
          this.snackBar.open('Usuário criado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao criar usuário.', 'Fechar', {
            duration: 3000,
          });
          console.error('Erro ao criar usuário:', err);
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * Volta para a lista de usuários.
   */
  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}

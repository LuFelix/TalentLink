import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importe RouterModule para routerLink
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Importações do Angular Material - Todas precisam ser importadas diretamente para standalone
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf, *ngFor etc.

@Component({
  selector: 'app-register',
  standalone: true, // <<< Marcado como standalone
  imports: [
    CommonModule,
    ReactiveFormsModule, // Essencial para formulários reativos
    RouterModule, // Para usar routerLink no HTML
    HttpClientModule, // Para fazer requisições HTTP
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  private apiUrl = 'https://talentlink.local/api/auth';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Validador de senha
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.snackBar.open(
        'Por favor, preencha todos os campos corretamente.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    this.loading = true;
    const { email, password } = this.registerForm.value;

    this.http.post(`${this.apiUrl}/register`, { email, password }).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open(
          'Usuário registrado com sucesso! Faça login.',
          'Fechar',
          { duration: 5000 }
        );
        this.router.navigate(['/login']); // Redireciona para a tela de login
      },
      error: (error) => {
        this.loading = false;
        let errorMessage = 'Ocorreu um erro ao registrar. Tente novamente.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Fechar', { duration: 5000 });
        console.error('Erro de registro:', error);
      },
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como ngIf, ngFor, etc.
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'; // Para usar formulários reativos
import { RouterModule, Router } from '@angular/router'; // Para usar routerLink e router
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup; // Define o formulário reativo

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário com campos e validadores
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email obrigatório e formato de email
      password: ['', [Validators.required, Validators.minLength(6)]], // Senha obrigatória e min. 6 caracteres
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulário de Login Válido:', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido!', response);
          // *** REDIRECIONAMENTO APÓS LOGIN ***
          this.router.navigate(['/dashboard']); // Redireciona para a futura página de perfil
        },
        error: (error) => {
          console.error('Erro no login:', error);
          // Exibir mensagem de erro para o usuário (ex: credenciais inválidas)
          alert('Falha no login. Verifique suas credenciais.');
        },
      });
    } else {
      console.log('Formulário de Login Inválido');
      // Mostrar mensagens de erro para o usuário
      // Marcar todos os campos como "touched" para exibir mensagens de erro
      this.loginForm.markAllAsTouched();
    }
  }
}

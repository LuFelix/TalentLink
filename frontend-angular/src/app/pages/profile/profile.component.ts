import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService, UserData } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Para notificações
import { HttpClient } from '@angular/common/http'; // Se for atualizar no backend
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router'; // Importe o Router
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule, // Para spinner de carregamento
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: UserData | null = null;
  isLoading = false;
  isEditing = false; // Para alternar entre modo de visualização e edição

  // private apiUrl = 'http://localhost:3000/api/users'; // URL para o endpoint de usuário, se tiver um

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router // Se for implementar atualização
  ) {
    this.profileForm = this.fb.group({
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ], // Email geralmente não é editável
      // Adicione outros campos de perfil aqui (nome, sobrenome, etc.)
      // exemplo: firstName: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          email: user.email,
          // Preencha outros campos aqui
        });
      }
    });
    // Você pode chamar uma API aqui para carregar mais detalhes do perfil se houver
    // this.loadUserProfile();
  }

  // loadUserProfile(): void {
  //   this.isLoading = true;
  //   this.http.get<any>(`${this.apiUrl}/me`).subscribe({ // Exemplo de endpoint
  //     next: (data) => {
  //       this.profileForm.patchValue({
  //         // Atualiza o formulário com dados da API
  //       });
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.snackBar.open('Erro ao carregar perfil.', 'Fechar', { duration: 3000 });
  //       this.isLoading = false;
  //     }
  //   });
  // }
  navigateToDashboard() {
    this.router.navigate(['/dashboard']); // Certifique-se que '/dashboard' é a rota correta do seu dashboard
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable(); // Habilita campos para edição
      // O email pode continuar desabilitado se não for editável
      this.profileForm.get('email')?.disable();
    } else {
      this.profileForm.disable(); // Desabilita campos após edição/cancelamento
    }
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open(
        'Por favor, corrija os erros no formulário.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }
    this.isLoading = true;
    const updatedProfile = this.profileForm.value;

    // TODO: Chamar um serviço para enviar os dados atualizados para o backend
    // this.http.put(`${this.apiUrl}/update`, updatedProfile).subscribe({
    //   next: (response) => {
    //     this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
    //     this.isLoading = false;
    //     this.isEditing = false;
    //     this.profileForm.disable(); // Volta para o modo de visualização
    //   },
    //   error: (err) => {
    //     this.snackBar.open('Erro ao atualizar perfil.', 'Fechar', { duration: 3000 });
    //     this.isLoading = false;
    //   }
    // });
    // Simulação de salvamento
    setTimeout(() => {
      this.snackBar.open(
        'Perfil atualizado com sucesso (simulado)!',
        'Fechar',
        { duration: 3000 }
      );
      this.isLoading = false;
      this.isEditing = false;
      this.profileForm.disable();
    }, 1000);
  }

  onCancel(): void {
    this.toggleEditMode(); // Volta para o modo de visualização
    // Opcional: Recarrega os dados originais se o usuário cancelar a edição
    if (this.currentUser) {
      this.profileForm.patchValue({
        email: this.currentUser.email,
      });
    }
  }
}

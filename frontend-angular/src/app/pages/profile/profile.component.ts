// // src/app/pages/profile/profile.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { HttpClient } from '@angular/common/http';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { Router } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule
// import { AuthService } from '../../auth/auth.service';
// import { UserData } from '../../shared/models/user.model';
// import { UserService } from '../../core/services/user.service'; // Importar o UserService
// import { Subscription } from 'rxjs'; // Importe Subscription
// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     ReactiveFormsModule,
//     MatProgressSpinnerModule,
//     MatIconModule,
//   ],
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss'],
// })
// export class ProfileComponent implements OnInit {
//   profileForm: FormGroup;
//   currentUser: UserData | null = null;
//   isLoading = false;
//   isEditing = false;
//   selectedFile: File | null = null; // Para o upload da foto

//   private apiUrl = 'http://localhost:3000/api/users'; // URL do seu endpoint de usuários
//   private userProfileSubscription!: Subscription;
//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private userService: UserService,
//     private snackBar: MatSnackBar,
//     private http: HttpClient,
//     private router: Router
//   ) {
//     this.profileForm = this.fb.group({
//       email: [
//         { value: '', disabled: true },
//         [Validators.required, Validators.email],
//       ],
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       phone: ['', [Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]], // Ex: (XX) XXXXX-XXXX
//     });
//   }

//   ngOnInit(): void {
//     // ✅ AQUI: Inscreva-se no BehaviorSubject do UserService
//     this.userProfileSubscription =
//       this.userService.currentUserProfile$.subscribe((userProfile) => {
//         this.currentUser = userProfile;
//         if (userProfile) {
//           // Atualiza o formulário com os dados mais recentes do perfil
//           this.profileForm.patchValue({
//             email: userProfile.email,
//             firstName: userProfile.firstName,
//             lastName: userProfile.lastName,
//             phone: userProfile.phone || '',
//           });
//           // Garante que o email permaneça desabilitado
//           this.profileForm.get('email')?.disable();
//         }
//       });

//     // ✅ Dispara o carregamento inicial do perfil
//     // Isso fará com que o BehaviorSubject seja preenchido na primeira vez
//     this.userService.fetchUserProfile().subscribe({
//       error: (err) => {
//         console.error('Erro ao carregar perfil inicial:', err);
//         this.snackBar.open(
//           'Erro ao carregar perfil. Por favor, tente novamente.',
//           'Fechar',
//           { duration: 3000 }
//         );
//       },
//     });
//   }

//   // ✅ Implementa ngOnDestroy para evitar vazamento de memória
//   ngOnDestroy(): void {
//     if (this.userProfileSubscription) {
//       this.userProfileSubscription.unsubscribe();
//     }
//   }

//    navigateToDashboard(): void {
//     this.router.navigate(['/dashboard']);
//   }

//   toggleEditMode(): void {
//     this.isEditing = !this.isEditing;
//     if (this.isEditing) {
//       this.profileForm.enable(); // Habilita todos os campos
//       this.profileForm.get('email')?.disable(); // Mas mantém o email desabilitado/readonly
//     } else {
//       this.profileForm.disable(); // Desabilita o formulário
//       // Opcional: Reverter alterações não salvas aqui se cancelar
//       // this.onCancel();
//     }
//   }

//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//       this.snackBar.open(
//         `Arquivo selecionado: ${this.selectedFile.name}`,
//         'OK',
//         { duration: 2000 }
//       );
//       //Pré-visualizar a imagem:
//       // const reader = new FileReader();
//       // reader.onload = () => {
//       //   this.currentUser.profilePictureUrl = reader.result as string;
//       // };
//       // reader.readAsDataURL(this.selectedFile);
//     }
//   }

//   onSave(): void {
//     if (this.profileForm.invalid) {
//       this.snackBar.open(
//         'Por favor, corrija os erros no formulário.',
//         'Fechar',
//         { duration: 3000 }
//       );
//       this.profileForm.markAllAsTouched();
//       return;
//     }
//     this.isLoading = true;

//     const updatedProfileData = this.profileForm.getRawValue();

//     // Chame o UserService para atualizar o perfil
//     this.userService
//       .updateUserProfile(updatedProfileData, this.selectedFile)
//       .subscribe({
//         next: (response: UserData) => {
//           this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
//             duration: 3000,
//           });
//           this.isLoading = false;
//           this.isEditing = false;
//           this.profileForm.disable();
//           this.profileForm.get('email')?.disable();
//           this.selectedFile = null;
//         },
//         error: (err: any) => {
//           console.error('Erro ao atualizar perfil:', err);
//           let errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
//           if (err.error && err.error.message) {
//             errorMessage = err.error.message;
//           }
//           this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
//           this.isLoading = false;
//         },
//       });
//   }

//   onCancel(): void {
//     this.isEditing = false; // Sai do modo de edição
//     this.profileForm.disable(); // Desabilita todos os campos
//     this.profileForm.get('email')?.disable(); // Garante que o email fica desabilitado

//     // Recarrega os valores originais do `currentUser` no formulário
//     if (this.currentUser) {
//       this.profileForm.patchValue({
//         email: this.currentUser.email,
//         firstName: this.currentUser.firstName,
//         lastName: this.currentUser.lastName,
//         phone: this.currentUser.phone || '',
//       });
//     }
//     this.selectedFile = null; // Limpa qualquer arquivo selecionado
//     this.snackBar.open('Edição cancelada.', 'Fechar', { duration: 1500 });
//   }
// }

// src/app/pages/profile/profile.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserData } from '../../shared/models/user.model';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';

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
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  currentUser: UserData | null = null;
  isLoading = false;
  isEditing = false;
  selectedFile: File | null = null;

  private userProfileSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
    });
  }

  ngOnInit(): void {
    this.userProfileSubscription =
      this.userService.currentUserProfile$.subscribe((userProfile) => {
        this.currentUser = userProfile;
        if (userProfile) {
          this.profileForm.patchValue({
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phone: userProfile.phone || '',
          });
          // ✅ Apenas o e-mail é desabilitado, os outros campos dependem de isEditing
          this.profileForm.get('email')?.disable();
          this.profileForm.disable();
        }
      });

    this.userService.fetchUserProfile().subscribe({
      error: (err) => {
        console.error('Erro ao carregar perfil inicial:', err);
        this.snackBar.open(
          'Erro ao carregar perfil. Por favor, tente novamente.',
          'Fechar',
          { duration: 3000 }
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription.unsubscribe();
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable(); // Habilita o formulário para edição
      this.profileForm.get('email')?.disable(); // Mas mantém o email desabilitado
    } else {
      this.profileForm.disable(); // Desabilita o formulário
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.snackBar.open(
        `Arquivo selecionado: ${this.selectedFile.name}`,
        'OK',
        { duration: 2000 }
      );
    }
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open(
        'Por favor, corrija os erros no formulário.',
        'Fechar',
        { duration: 3000 }
      );
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const updatedProfileData = this.profileForm.getRawValue();

    this.userService
      .updateUserProfile(updatedProfileData, this.selectedFile)
      .subscribe({
        next: () => {
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.isLoading = false;
          this.isEditing = false; // Desativa o modo de edição
          this.profileForm.disable(); // Desabilita o formulário após a atualização
          this.profileForm.get('email')?.disable();
          this.selectedFile = null;
        },
        error: (err: any) => {
          console.error('Erro ao atualizar perfil:', err);
          let errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }
          this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
          this.isLoading = false;
        },
      });
  }

  onCancel(): void {
    this.isEditing = false;
    this.profileForm.disable();
    if (this.currentUser) {
      this.profileForm.patchValue({
        email: this.currentUser.email,
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        phone: this.currentUser.phone || '',
      });
    }
    this.profileForm.get('email')?.disable();
    this.selectedFile = null;
    this.snackBar.open('Edição cancelada.', 'Fechar', { duration: 1500 });
  }
}

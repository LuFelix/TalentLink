// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

// Importe a interface UserData
import { UserData } from '../../shared/models/user.model'; // Ajuste o caminho

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Endpoint para usuários
  private _currentUserProfile = new BehaviorSubject<UserData | null>(null);
  currentUserProfile$: Observable<UserData | null> =
    this._currentUserProfile.asObservable();

  constructor(private http: HttpClient) {}

  // Método para buscar o perfil completo do usuário logado
  fetchUserProfile(): Observable<UserData> {
    // O backend deve inferir o ID do usuário a partir do token de autenticação
    return this.http.get<UserData>(`${this.apiUrl}/me`).pipe(
      tap((profile) => {
        this._currentUserProfile.next(profile); // Atualiza o BehaviorSubject
      })
    );
  }
  // // Método para atualizar o perfil do usuário
  // updateUserProfile(
  //   profileData: Partial<UserData>,
  //   file?: File | null
  // ): Observable<UserData> {
  //   const formData = new FormData();

  //   // Anexar dados do formulário
  //   for (const key in profileData) {
  //     if (
  //       profileData.hasOwnProperty(key) &&
  //       profileData[key as keyof UserData] !== undefined
  //     ) {
  //       formData.append(key, String(profileData[key as keyof UserData])); // <--- E AQUI
  //     }
  //   }

  //   // Anexar arquivo se existir
  //   if (file) {
  //     formData.append('profilePicture', file, file.name);
  //   }

  //   // O backend deve inferir o ID do usuário a partir do token
  //   return this.http.put<UserData>(`${this.apiUrl}/me`, formData).pipe(
  //     tap((updatedProfile) => {
  //       this._currentUserProfile.next(updatedProfile); // Atualiza o BehaviorSubject com os novos dados
  //     })
  //   );
  // }
  // updateUserProfile(
  //   profileData: Partial<UserData>,
  //   file?: File | null
  // ): Observable<UserData> {
  //   const formData = new FormData();

  //   // Anexar dados do formulário
  //   for (const key in profileData) {
  //     if (
  //       profileData.hasOwnProperty(key) &&
  //       profileData[key as keyof UserData] !== undefined
  //     ) {
  //       // ✅ Solução: Remova a conversão para String.
  //       // O FormData pode lidar com diferentes tipos de dados.
  //       const value = profileData[key as keyof UserData];
  //       if (value !== null && value !== undefined) {
  //         formData.append(key, value as any);
  //       }
  //     }
  //   }

  //   // Anexar arquivo se existir
  //   if (file) {
  //     formData.append('profilePicture', file, file.name);
  //   }

  //   return this.http.put<UserData>(`${this.apiUrl}/me`, formData).pipe(
  //     tap((updatedProfile) => {
  //       this._currentUserProfile.next(updatedProfile);
  //     })
  //   );
  // }

  // updateUserProfile(
  //   profileData: Partial<UserData>,
  //   file?: File | null
  // ): Observable<UserData> {
  //   const formData = new FormData();

  //   // Iterar e adicionar cada campo ao FormData
  //   for (const key in profileData) {
  //     if (
  //       profileData.hasOwnProperty(key) &&
  //       profileData[key as keyof UserData] !== undefined
  //     ) {
  //       const value = profileData[key as keyof UserData];
  //       if (value !== null && value !== undefined) {
  //         // ✅ CORREÇÃO: Adicione o valor diretamente sem converter para String.
  //         // O FormData lidará com o tipo de dado original.
  //         formData.append(key, value as any);
  //       }
  //     }
  //   }

  //   // Anexar o arquivo, se ele existir
  //   if (file) {
  //     formData.append('profilePicture', file, file.name);
  //   }

  //   // Fazer a requisição PUT para a rota do backend
  //   return this.http.put<UserData>(`${this.apiUrl}/me`, formData).pipe(
  //     tap((updatedProfile) => {
  //       this._currentUserProfile.next(updatedProfile);
  //     })
  //   );
  // }
  updateUserProfile(
    profileData: Partial<UserData>,
    file?: File | null
  ): Observable<UserData> {
    const formData = new FormData();

    // Desestrutura o objeto para remover o email
    const { email, ...dataToUpdate } = profileData;

    // Itera sobre as chaves do objeto sem o email
    for (const key in dataToUpdate) {
      if (Object.prototype.hasOwnProperty.call(dataToUpdate, key)) {
        const value = dataToUpdate[key as keyof typeof dataToUpdate];

        if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      }
    }

    // Anexa o arquivo, se ele existir
    if (file) {
      formData.append('profilePicture', file, file.name);
    }

    // Faz a requisição PUT para a rota do backend
    return this.http.put<UserData>(`${this.apiUrl}/me`, formData).pipe(
      tap((updatedProfile) => {
        this._currentUserProfile.next(updatedProfile);
      })
    );
  }
  // Método para atualizar o BehaviorSubject manualmente (usado pelo AuthService na inicialização, se quiser)
  setCurrentUserProfile(user: UserData | null): void {
    this._currentUserProfile.next(user);
  }
}

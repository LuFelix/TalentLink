import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Para fazer requisições HTTP
import { Observable, tap, BehaviorSubject } from 'rxjs'; // Para lidar com respostas assíncronas
import { Router } from '@angular/router'; // Para redirecionar após o login

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // URL base da API de autenticação
  // BehaviorSubject para emitir o estado de autenticação
  // Inicializa com base na existência do token no localStorage
  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  // Observable público para que outros componentes possam se inscrever
  isAuthenticated$ = this._isAuthenticated.asObservable(); // Convenção: $ para Observables

  constructor(private http: HttpClient, private router: Router) {}
  // Método auxiliar para verificar o token no localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
  // Método para fazer a requisição de login para o backend
  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          // Armazena o token de acesso no localStorage após o login bem-sucedido
          localStorage.setItem('access_token', response.access_token);
          console.log('Token armazenado:', response.access_token);
          this._isAuthenticated.next(true); // Atualiza o estado de autenticação
        })
      );
  }
  // Método para verificar se o usuário está logado (verifica a existência do token)
  //Retirado para usar o BehaviorSubject
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
  // Método para obter o token armazenado
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  // Método para fazer logout (remover o token e redirecionar)
  logout(): void {
    localStorage.removeItem('access_token');
    console.log('Token removido. Usuário deslogado.');
    this._isAuthenticated.next(false); // <-- Notifica que NÃO está mais autenticado
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}

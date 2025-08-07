import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Para fazer requisições HTTP
import { Observable, tap, BehaviorSubject } from 'rxjs'; // Para lidar com respostas assíncronas
import { Router } from '@angular/router'; // Para redirecionar após o login
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, UserData } from '../shared/models/user.model';
// Interface para os dados do token decodificado (payload)
// Interface para o objeto de usuário que será armazenado no serviço

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://talentlink.local/api/auth'; // URL base da API de autenticação
  // BehaviorSubject para emitir o estado de autenticação
  // Inicializa com base na existência do token no localStorage
  private tokenKey = 'access_token'; // Chave para armazenar o token no localStorage

  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  // Observable público para que outros componentes possam se inscrever
  isAuthenticated$ = this._isAuthenticated.asObservable(); // Convenção: $ para Observables

  private _loggedInUser = new BehaviorSubject<UserData | null>(null);
  loggedInUser$ = this._loggedInUser.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Ao iniciar o serviço, tenta carregar e decodificar o token existente
    this.loadUserFromToken();
  }

  register(userData: any) {
    // ✅ Use a nova rota pública de registro
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Verifica se existe um token e se ele é válido (não expirado)
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decoded = this.decodeToken(token);
    // Verifica se o token existe e se a data de expiração (exp) ainda não passou
    return decoded !== null && decoded.exp * 1000 > Date.now();
  }

  // Tenta carregar e decodificar o token, e define o usuário logado
  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        // Se válido
        this._loggedInUser.next({
          userId: decoded.sub,
          email: decoded.email,
          roles: decoded.roles,
          firstName: '', // Pode ser preenchido com dados adicionais do backend
          lastName: '', // Pode ser preenchido com dados adicionais do backend
          phone: undefined, // Pode ser preenchido com dados adicionais do backend          profilePictureUrl: undefined, // Pode ser preenchido com dados adicionais do backend
        });
        this._isAuthenticated.next(true);
      } else {
        // Se o token estiver expirado ou inválido
        this.logout(); // Desloga
      }
    } else {
      this._loggedInUser.next(null);
      this._isAuthenticated.next(false);
    }
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.loadUserFromToken(); // Carrega e define o usuário após o login
          console.log('Token e usuário definidos após login.');
        })
      );
  }

  // Método para obter o token armazenado
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Retorna os dados do usuário logado (de forma síncrona, se já estiver carregado)
  getLoggedInUser(): UserData | null {
    return this._loggedInUser.value;
  }

  // Verifica se o usuário tem uma role específica
  hasRole(role: string): boolean {
    const user = this.getLoggedInUser();
    return user ? user.roles.includes(role) : false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._loggedInUser.next(null); // Limpa os dados do usuário
    this._isAuthenticated.next(false);
    console.log('Token e usuário removidos. Usuário deslogado.');
    this.router.navigate(['/login']);
  }

  // Decodifica o token JWT usando jwt-decode
  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Erro ao decodificar token JWT:', error);
      return null;
    }
  }
}

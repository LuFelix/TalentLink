// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Obtenha o token do seu AuthService.
    // Certifique-se de que o AuthService tem um método para obter o token (ex: getToken()).
    const authToken = this.authService.getToken();

    // Se o token existe, clone a requisição e adicione o cabeçalho Authorization
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`, // Formato padrão para tokens JWT
        },
      });
    }

    // Continue com a requisição modificada (ou original, se não houver token)
    return next.handle(request);
  }
}

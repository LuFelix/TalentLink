// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor
// import { MatTableModule } from '@angular/material/table'; // Para a tabela
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDialog } from '@angular/material/dialog'; // Para o diálogo de confirmação
// import { MatSnackBar } from '@angular/material/snack-bar'; // Para notificações
// import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component'; // Caminho para o seu ConfirmDialogComponent
// import { HttpClient } from '@angular/common/http'; // Para fazer chamadas HTTP
// import { AuthService } from '../../../auth/auth.service'; // Para pegar o token ou verificar roles
// import { MatCardModule } from '@angular/material/card'; // Para mat-card, mat-card-header, mat-card-content, mat-card-title
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para mat-spinner
// import { Router } from '@angular/router';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { fromEvent, Subscription } from 'rxjs';
// import { debounceTime, throttleTime, filter, map } from 'rxjs/operators';

// export interface ApiResponse {
//   data: User[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }
// export interface User {
//   id: number;
//   email: string;
//   roles: string[];
//   createdAt: string;
//   isActive: boolean;
// }

// @Component({
//   selector: 'app-user-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatButtonModule,
//     MatIconModule,
//     MatCardModule,
//     MatProgressSpinnerModule,
//     MatPaginatorModule, // <<< Adicione MatPaginatorModule
//     ConfirmDialogComponent,
//     // MatDialogModule é fornecido no app.config.ts, mas o MatDialog (o serviço) é injetado.
//   ],
//   templateUrl: './user-list.component.html',
//   styleUrls: ['./user-list.component.scss'],
// })
// export class UserListComponent implements OnInit {
//   displayedColumns: string[] = ['id', 'email', 'roles', 'actions'];
//   users: User[] = [];
//   isLoading = false;
//   private apiUrl = 'https://talentlink.local/api/users'; // <<< URL para seu endpoint de usuários no backend

//   constructor(
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private http: HttpClient,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     console.log(
//       'UserListComponent ngOnInit chamado. Tentando carregar usuários...'
//     );
//     this.loadUsers();
//   }

//   loadUsers(): void {
//     console.log('loadUsers() chamado. Disparando GET para:', this.apiUrl);
//     this.isLoading = true;
//     // Opcional: Adicionar um interceptor para anexar o token automaticamente
//     this.http.get<ApiResponse>(this.apiUrl).subscribe({
//       next: (response) => {
//         this.users = response.data;
//         console.log('Dados de usuários recebidos:', response);
//         console.log(
//           'Users array populado, length:',
//           this.users.length,
//           'data type:',
//           typeof this.users
//         ); // Novo log
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.snackBar.open('Erro ao carregar usuários.', 'Fechar', {
//           duration: 3000,
//         });
//         console.error('Erro ao carregar usuários:', err);
//         this.isLoading = false;
//       },
//     });
//   }

//   openDeleteDialog(user: User): void {
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       width: '300px',
//       data: {
//         title: 'Confirmar Exclusão',
//         message: `Tem certeza que deseja excluir o usuário ${user.email}?`,
//       },
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         this.deleteUser(user.id);
//       }
//     });
//   }

//   deleteUser(userId: number): void {
//     this.http.delete(`${this.apiUrl}/${userId}`).subscribe({
//       next: () => {
//         this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', {
//           duration: 3000,
//         });
//         this.loadUsers(); // Recarrega a lista
//       },
//       error: (err) => {
//         this.snackBar.open('Erro ao excluir usuário.', 'Fechar', {
//           duration: 3000,
//         });
//         console.error('Erro ao excluir usuário:', err);
//       },
//     });
//   }
//   /**
//    * Navega para a página de adição de usuário.
//    */
//   addUser(): void {
//     // Você precisará definir esta rota no seu arquivo de rotas (app.routes.ts ou admin.routes.ts)
//     this.router.navigate(['/admin/users/new']);
//   }
//   /**
//    * Navega para a página de edição de usuário, passando o ID do usuário.
//    * @param user O objeto de usuário a ser editado.
//    */
//   editUser(user: User): void {
//     // Você precisará definir esta rota no seu arquivo de rotas (app.routes.ts ou admin.routes.ts)
//     this.router.navigate(['/admin/users/edit', user.id]);
//   }
// }

// // src/app/admin/user-list/user-list.component.ts
// import {
//   Component,
//   OnInit,
//   OnDestroy,
//   ViewChild,
//   ElementRef,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../../../auth/auth.service';
// import { MatCardModule } from '@angular/material/card';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { Router } from '@angular/router';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // <<< Importe MatPaginatorModule e PageEvent
// import { fromEvent, Subscription } from 'rxjs'; // <<< Importe para rolagem infinita
// import { debounceTime, throttleTime, filter, map } from 'rxjs/operators'; // <<< Operadores RxJS

// // ... (suas interfaces ApiResponse e User)
// // Certifique-se que sua interface User inclui id, email, roles, isActive
// export interface User {
//   id: number;
//   email: string;
//   roles: string[];
//   isActive?: boolean;
// }

// // Adapte esta interface para o que seu backend retorna para paginação
// export interface PaginationResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   lastPage: number;
// }

// @Component({
//   selector: 'app-user-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatButtonModule,
//     MatIconModule,
//     MatCardModule,
//     MatProgressSpinnerModule,
//     MatPaginatorModule, // <<< Adicione MatPaginatorModule
//     ConfirmDialogComponent, // Se ConfirmDialogComponent for usado diretamente aqui
//   ],
//   templateUrl: './user-list.component.html',
//   styleUrls: ['./user-list.component.scss'],
// })
// export class UserListComponent implements OnInit, OnDestroy {
//   @ViewChild('tableScrollContainer') tableScrollContainer!: ElementRef; // Para rolagem infinita

//   displayedColumns: string[] = ['id', 'email', 'roles', 'actions'];
//   users: User[] = [];
//   isLoading = false;
//   isScrollingLoading = false; // Novo estado para carregamento da rolagem
//   private apiUrl = 'https://talentlink.local/api/users';

//   // Variáveis para Paginação
//   totalUsers = 0;
//   currentPage = 1;
//   pageSize = 10; // Tamanho inicial da página
//   pageSizeOptions: number[] = [5, 10, 25, 50]; // Opções de itens por página

//   // Variáveis para Rolagem Infinita
//   private scrollSubscription: Subscription | undefined;
//   private hasMorePages = true; // Indica se ainda há mais páginas para carregar

//   constructor(
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private http: HttpClient,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadUsers(this.currentPage, this.pageSize);
//   }

//   ngAfterViewInit(): void {
//     // Configura o evento de rolagem APENAS se o elemento existir
//     if (this.tableScrollContainer) {
//       this.setupScrollListener();
//     } else {
//       // Se não houver ViewChild no HTML, ou se o elemento for condicional
//       // Uma alternativa para a rolagem infinita pode ser no window ou no document
//       // ou garantir que o elemento exista quando o componente é inicializado.
//       // Por simplicidade, assumindo que `table-scroll-container` é sempre renderizado.
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.scrollSubscription) {
//       this.scrollSubscription.unsubscribe();
//     }
//   }

//   /**
//    * Carrega os usuários com paginação.
//    * @param page O número da página a ser carregada.
//    * @param limit O número de itens por página.
//    * @param append Se true, adiciona usuários aos existentes (para rolagem infinita).
//    */
//   loadUsers(page: number, limit: number, append: boolean = false): void {
//     if (this.isLoading || (this.isScrollingLoading && append)) {
//       return; // Evita múltiplas requisições simultâneas
//     }

//     if (append) {
//       this.isScrollingLoading = true;
//     } else {
//       this.isLoading = true;
//     }

//     this.http
//       .get<PaginationResult<User>>(`${this.apiUrl}?page=${page}&limit=${limit}`)
//       .subscribe({
//         next: (response) => {
//           // Assume que a resposta é um objeto PaginationResult
//           if (append) {
//             this.users = [...this.users, ...response.data];
//           } else {
//             this.users = response.data;
//           }
//           this.totalUsers = response.total;
//           this.currentPage = response.page;
//           this.pageSize = response.limit;
//           this.hasMorePages = response.page < response.lastPage; // Verifica se há mais páginas

//           this.isLoading = false;
//           this.isScrollingLoading = false;
//         },
//         error: (err) => {
//           this.snackBar.open('Erro ao carregar usuários.', 'Fechar', {
//             duration: 3000,
//           });
//           console.error('Erro ao carregar usuários:', err);
//           this.isLoading = false;
//           this.isScrollingLoading = false;
//         },
//       });
//   }

//   /**
//    * Lida com a mudança de página do MatPaginator.
//    * @param event O evento de página.
//    */
//   onPageChange(event: PageEvent): void {
//     this.currentPage = event.pageIndex + 1; // pageIndex é base 0
//     this.pageSize = event.pageSize;
//     this.loadUsers(this.currentPage, this.pageSize);
//   }

//   /**
//    * Configura o listener de rolagem para carregamento infinito.
//    */
//   private setupScrollListener(): void {
//     this.scrollSubscription = fromEvent(
//       this.tableScrollContainer.nativeElement,
//       'scroll'
//     )
//       .pipe(
//         throttleTime(200), // Evita que o evento seja disparado muito rapidamente
//         filter(
//           () => this.hasMorePages && !this.isLoading && !this.isScrollingLoading
//         ), // Só carrega se houver mais páginas e não estiver carregando
//         map((event: Event) => event.target as HTMLElement),
//         filter((element: HTMLElement) => {
//           // Verifica se o usuário scrollou perto do final
//           const scrollPosition = element.scrollTop + element.clientHeight;
//           const scrollHeight = element.scrollHeight;
//           return scrollPosition >= scrollHeight * 0.9; // 90% do final da rolagem
//         }),
//         debounceTime(300) // Pequeno atraso para evitar chamadas duplicadas
//       )
//       .subscribe(() => {
//         this.currentPage++; // Incrementa a página para carregar a próxima
//         this.loadUsers(this.currentPage, this.pageSize, true); // Carrega mais usuários, adicionando-os
//       });
//   }

//   openDeleteDialog(user: User): void {
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       data: {
//         title: 'Confirmar Exclusão',
//         message: `Tem certeza que deseja excluir o usuário "${user.email}"?`,
//       },
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         this.deleteUser(user.id);
//       }
//     });
//   }

//   deleteUser(id: number): void {
//     this.http.delete(`${this.apiUrl}/${id}`).subscribe({
//       next: () => {
//         this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', {
//           duration: 3000,
//         });
//         // Recarrega os usuários da página atual para garantir que a lista esteja atualizada
//         this.loadUsers(this.currentPage, this.pageSize);
//       },
//       error: (err) => {
//         this.snackBar.open('Erro ao excluir usuário.', 'Fechar', {
//           duration: 3000,
//         });
//         console.error('Erro ao excluir usuário:', err);
//       },
//     });
//   }

//   addUser(): void {
//     this.router.navigate(['/admin/users/new']);
//   }

//   editUser(user: User): void {
//     this.router.navigate(['/admin/users/edit', user.id]);
//   }
// }
// src/app/admin/user-list/user-list.component.ts

// import {
//   Component,
//   OnInit,
//   OnDestroy,
//   ViewChild,
//   ElementRef,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../../../auth/auth.service';
// import { MatCardModule } from '@angular/material/card';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { Router } from '@angular/router';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { fromEvent, Subscription } from 'rxjs';
// import { debounceTime, throttleTime, filter, map } from 'rxjs/operators';

// // ... (suas interfaces User e PaginationResult)

// @Component({
//   selector: 'app-user-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatButtonModule,
//     MatIconModule,
//     MatCardModule,
//     MatProgressSpinnerModule,
//     MatPaginatorModule,
//     ConfirmDialogComponent,
//   ],
//   templateUrl: './user-list.component.html',
//   styleUrls: ['./user-list.component.scss'],
// })
// export class UserListComponent implements OnInit, OnDestroy {
//   @ViewChild('tableScrollContainer') tableScrollContainer!: ElementRef;

//   // ... (suas outras propriedades) ...

//   constructor(
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private http: HttpClient,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadUsers(this.currentPage, this.pageSize);
//   }

//   ngAfterViewInit(): void {
//     // É importante garantir que tableScrollContainer esteja disponível
//     // antes de tentar adicionar o listener.
//     // Opcional: Adicione um setTimeout para garantir que o DOM esteja pronto,
//     // embora `AfterViewInit` geralmente já garanta isso.
//     if (this.tableScrollContainer && this.tableScrollContainer.nativeElement) {
//       this.setupScrollListener();
//     } else {
//       console.warn(
//         'tableScrollContainer não encontrado. A rolagem infinita pode não funcionar.'
//       );
//       // Você pode querer adicionar uma lógica para tentar novamente ou desabilitar a funcionalidade.
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.scrollSubscription) {
//       this.scrollSubscription.unsubscribe();
//     }
//   }

//   // ... (loadUsers, onPageChange, openDeleteDialog, deleteUser, addUser, editUser) ...

//   /**
//    * Configura o listener de rolagem para carregamento infinito.
//    */
//   private setupScrollListener(): void {
//     this.scrollSubscription = fromEvent<Event>( // <<<<< ADICIONE <Event> AQUI
//       this.tableScrollContainer.nativeElement,
//       'scroll'
//     )
//       .pipe(
//         throttleTime(200),
//         filter(
//           () => this.hasMorePages && !this.isLoading && !this.isScrollingLoading
//         ),
//         map((event: Event) => event.target as HTMLElement),
//         filter((element: HTMLElement) => {
//           const scrollPosition = element.scrollTop + element.clientHeight;
//           const scrollHeight = element.scrollHeight;
//           return scrollPosition >= scrollHeight * 0.9;
//         }),
//         debounceTime(300)
//       )
//       .subscribe(() => {
//         this.currentPage++;
//         this.loadUsers(this.currentPage, this.pageSize, true);
//       });
//   }
// }
// src/app/admin/user-list/user-list.component.ts

// src/app/admin/user-list/user-list.component.ts
// import {
//   Component,
//   OnInit,
//   OnDestroy,
//   ViewChild,
//   ElementRef,
//   AfterViewInit,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../../../auth/auth.service';
// import { MatCardModule } from '@angular/material/card';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { Router } from '@angular/router';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { fromEvent, Subscription } from 'rxjs';
// import { debounceTime, throttleTime, filter, map } from 'rxjs/operators';

// // Interfaces (garanta que estas estejam definidas, ou em um arquivo compartilhado)
// export interface User {
//   id: number;
//   email: string;
//   roles: string[];
//   isActive?: boolean;
// }

// export interface PaginationResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   lastPage: number;
// }

// @Component({
//   selector: 'app-user-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatButtonModule,
//     MatIconModule,
//     MatCardModule,
//     MatProgressSpinnerModule,
//     MatPaginatorModule,
//     ConfirmDialogComponent, // Certifique-se de que este componente está acessível e standalone: true
//   ],
//   templateUrl: './user-list.component.html',
//   styleUrls: ['./user-list.component.scss'],
// })
// export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
//   // <<< Interfaces implementadas aqui
//   // O @ViewChild deve referenciar um elemento no HTML com #tableScrollContainer
//   @ViewChild('tableScrollContainer') tableScrollContainer!: ElementRef;

//   // Propriedades da Tabela
//   displayedColumns: string[] = ['id', 'email', 'roles', 'actions'];
//   users: User[] = [];

//   // Propriedades de Estado e Carregamento
//   isLoading = false; // Estado geral de carregamento (inicial, ou de recarga de página)
//   isScrollingLoading = false; // Estado de carregamento para rolagem infinita
//   private apiUrl = 'https://talentlink.local/api/users'; // URL da sua API

//   // Propriedades de Paginação
//   totalUsers = 0; // Total de usuários no backend
//   currentPage = 1; // Página atual (base 1)
//   pageSize = 10; // Itens por página
//   pageSizeOptions: number[] = [5, 10, 25, 50]; // Opções para o MatPaginator

//   // Propriedades para Rolagem Infinita
//   private scrollSubscription: Subscription | undefined; // Gerencia a inscrição do evento de rolagem
//   private hasMorePages = true; // Indica se ainda há mais páginas para carregar via rolagem

//   constructor(
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private http: HttpClient,
//     private authService: AuthService, // Se ainda usa AuthService para algo aqui
//     private router: Router
//   ) {}

//   // --- Métodos do Ciclo de Vida do Angular ---
//   ngOnInit(): void {
//     // Carrega a primeira página de usuários ao inicializar o componente
//     this.loadUsers(this.currentPage, this.pageSize);
//   }

//   ngAfterViewInit(): void {
//     // Garante que o elemento 'tableScrollContainer' esteja disponível no DOM
//     // antes de tentar configurar o listener de rolagem.
//     if (this.tableScrollContainer && this.tableScrollContainer.nativeElement) {
//       this.setupScrollListener();
//     } else {
//       console.warn(
//         'tableScrollContainer não encontrado. A rolagem infinita pode não funcionar.'
//       );
//     }
//   }

//   ngOnDestroy(): void {
//     // Desinscreve-se do evento de rolagem para evitar vazamentos de memória
//     if (this.scrollSubscription) {
//       this.scrollSubscription.unsubscribe();
//     }
//   }

//   // --- Métodos de Carregamento e Paginação ---
//   /**
//    * Carrega os usuários do backend com paginação.
//    * @param page O número da página a ser carregada (base 1).
//    * @param limit O número de itens por página.
//    * @param append Se true, adiciona os novos usuários aos existentes (para rolagem infinita).
//    */
//   loadUsers(page: number, limit: number, append: boolean = false): void {
//     // Evita múltiplas requisições simultâneas
//     if (this.isLoading || (this.isScrollingLoading && append)) {
//       return;
//     }

//     // Define o estado de carregamento apropriado
//     if (append) {
//       this.isScrollingLoading = true;
//     } else {
//       this.isLoading = true;
//     }

//     // Faz a requisição HTTP para a API com os parâmetros de paginação
//     this.http
//       .get<PaginationResult<User>>(`${this.apiUrl}?page=${page}&limit=${limit}`)
//       .subscribe({
//         next: (response) => {
//           // Se for para adicionar (rolagem infinita), concatena os arrays
//           if (append) {
//             this.users = [...this.users, ...response.data];
//           } else {
//             // Caso contrário, substitui a lista de usuários (para paginação normal)
//             this.users = response.data;
//           }
//           // Atualiza os dados de paginação
//           this.totalUsers = response.total;
//           this.currentPage = response.page;
//           this.pageSize = response.limit;
//           // Verifica se ainda há mais páginas a serem carregadas
//           this.hasMorePages = response.page < response.lastPage;

//           // Finaliza os estados de carregamento
//           this.isLoading = false;
//           this.isScrollingLoading = false;
//         },
//         error: (err) => {
//           // Exibe mensagem de erro e finaliza estados de carregamento
//           this.snackBar.open('Erro ao carregar usuários.', 'Fechar', {
//             duration: 3000,
//           });
//           console.error('Erro ao carregar usuários:', err);
//           this.isLoading = false;
//           this.isScrollingLoading = false;
//         },
//       });
//   }

//   /**
//    * Manipula o evento de mudança de página do MatPaginator.
//    * @param event O objeto PageEvent contendo informações da página.
//    */
//   onPageChange(event: PageEvent): void {
//     this.currentPage = event.pageIndex + 1; // pageIndex é base 0, convertemos para base 1
//     this.pageSize = event.pageSize;
//     this.loadUsers(this.currentPage, this.pageSize); // Recarrega os usuários para a nova página
//   }

//   // --- Métodos para Rolagem Infinita ---
//   /**
//    * Configura o listener de evento de rolagem para o carregamento infinito.
//    */
//   private setupScrollListener(): void {
//     this.scrollSubscription = fromEvent<Event>( // Tipagem explícita para o evento
//       this.tableScrollContainer.nativeElement,
//       'scroll'
//     )
//       .pipe(
//         throttleTime(200), // Limita a frequência de emissão do evento de rolagem
//         filter(
//           () => this.hasMorePages && !this.isLoading && !this.isScrollingLoading // Condições para carregar mais
//         ),
//         map((event: Event) => event.target as HTMLElement), // Mapeia o evento para o elemento DOM que rolou
//         filter((element: HTMLElement) => {
//           // Calcula a posição de rolagem para determinar se o usuário está perto do final
//           const scrollPosition = element.scrollTop + element.clientHeight;
//           const scrollHeight = element.scrollHeight;
//           return scrollPosition >= scrollHeight * 0.9; // Carrega quando 90% da rolagem foi alcançada
//         }),
//         debounceTime(300) // Pequeno atraso para evitar múltiplas chamadas ao parar de rolar
//       )
//       .subscribe(() => {
//         // Se as condições forem atendidas, incrementa a página e carrega mais usuários
//         this.currentPage++;
//         this.loadUsers(this.currentPage, this.pageSize, true); // O 'true' indica para adicionar os usuários
//       });
//   }

//   // --- Métodos de Ação (CRUD) ---
//   /**
//    * Abre o diálogo de confirmação para exclusão de usuário.
//    * @param user O usuário a ser excluído.
//    */
//   openDeleteDialog(user: User): void {
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       data: {
//         title: 'Confirmar Exclusão',
//         message: `Tem certeza que deseja excluir o usuário "${user.email}"? Esta ação é irreversível.`,
//       },
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         this.deleteUser(user.id);
//       }
//     });
//   }

//   /**
//    * Envia requisição para excluir um usuário.
//    * @param id O ID do usuário a ser excluído.
//    */
//   deleteUser(id: number): void {
//     this.http.delete(`${this.apiUrl}/${id}`).subscribe({
//       next: () => {
//         this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', {
//           duration: 3000,
//         });
//         // Após a exclusão, recarrega a página atual para atualizar a lista
//         this.loadUsers(this.currentPage, this.pageSize);
//       },
//       error: (err) => {
//         this.snackBar.open('Erro ao excluir usuário.', 'Fechar', {
//           duration: 3000,
//         });
//         console.error('Erro ao excluir usuário:', err);
//       },
//     });
//   }

//   /**
//    * Navega para a página de adição de usuário.
//    */
//   addUser(): void {
//     this.router.navigate(['/admin/users/new']);
//   }

//   /**
//    * Navega para a página de edição de usuário, passando o ID do usuário.
//    * @param user O objeto de usuário a ser editado.
//    */
//   editUser(user: User): void {
//     this.router.navigate(['/admin/users/edit', user.id]);
//   }
// }

// src/app/admin/user-list/user-list.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, throttleTime, filter, map } from 'rxjs/operators';

// Interfaces (garanta que estas estejam definidas, ou em um arquivo compartilhado)
export interface User {
  id: number;
  email: string;
  roles: string[];
  isActive?: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number; // Certifique-se que seu backend retorna lastPage
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
    MatPaginatorModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tableScrollContainer') tableScrollContainer!: ElementRef;

  displayedColumns: string[] = ['id', 'email', 'roles', 'actions'];
  users: User[] = [];

  isLoading = false;
  isScrollingLoading = false;
  private apiUrl = 'https://talentlink.local/api/users';

  totalUsers = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  private scrollSubscription: Subscription | undefined;
  hasMorePages = true;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit: Carregando usuários iniciais.');
    this.loadUsers(this.currentPage, this.pageSize);
  }

  ngAfterViewInit(): void {
    if (this.tableScrollContainer && this.tableScrollContainer.nativeElement) {
      console.log(
        'ngAfterViewInit: tableScrollContainer encontrado, configurando listener de rolagem.'
      );
      this.setupScrollListener();
    } else {
      console.warn(
        'ngAfterViewInit: tableScrollContainer não encontrado. A rolagem infinita pode não funcionar.'
      );
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy: Desinscrevendo do listener de rolagem.');
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  loadUsers(page: number, limit: number, append: boolean = false): void {
    console.log(
      `loadUsers chamado: page=${page}, limit=${limit}, append=${append}`
    );
    if (this.isLoading || (this.isScrollingLoading && append)) {
      console.log(
        'loadUsers: Requisição bloqueada (já carregando ou scroll loading).'
      );
      return;
    }

    if (append) {
      this.isScrollingLoading = true;
    } else {
      this.isLoading = true;
    }

    this.http
      .get<PaginationResult<User>>(`${this.apiUrl}?page=${page}&limit=${limit}`)
      .subscribe({
        next: (response) => {
          console.log('loadUsers: API Response recebida:', response);
          if (append) {
            this.users = [...this.users, ...response.data];
            console.log(
              'loadUsers: Usuários APENDADOS. Novo tamanho:',
              this.users.length
            );
          } else {
            this.users = response.data;
            console.log(
              'loadUsers: Usuários SUBSTITUÍDOS. Novo tamanho:',
              this.users.length
            );
          }
          this.totalUsers = response.total;
          this.currentPage = response.page;
          this.pageSize = response.limit;
          this.hasMorePages = response.page < response.totalPages;
          console.log(
            `loadUsers: Página atual: ${this.currentPage}, Última página: ${response.totalPages}, Tem mais páginas: ${this.hasMorePages}`
          );

          this.isLoading = false;
          this.isScrollingLoading = false;
        },
        error: (err) => {
          this.snackBar.open('Erro ao carregar usuários.', 'Fechar', {
            duration: 3000,
          });
          console.error('loadUsers: Erro ao carregar usuários:', err);
          this.isLoading = false;
          this.isScrollingLoading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    console.log('onPageChange disparado:', event);
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    // Quando o paginator é usado, sempre substituímos a lista
    this.loadUsers(this.currentPage, this.pageSize, false);
  }

  private setupScrollListener(): void {
    this.scrollSubscription = fromEvent<Event>(
      this.tableScrollContainer.nativeElement,
      'scroll'
    )
      .pipe(
        throttleTime(200),
        filter(() => {
          const canLoad =
            this.hasMorePages && !this.isLoading && !this.isScrollingLoading;
          // console.log(`setupScrollListener Filter 1: hasMorePages=${this.hasMorePages}, isLoading=${this.isLoading}, isScrollingLoading=${this.isScrollingLoading}, canLoad=${canLoad}`);
          return canLoad;
        }),
        map((event: Event) => event.target as HTMLElement),
        filter((element: HTMLElement) => {
          const scrollPosition = element.scrollTop + element.clientHeight;
          const scrollHeight = element.scrollHeight;
          const isNearEnd = scrollPosition >= scrollHeight * 0.9;
          // console.log(`setupScrollListener Filter 2: scrollPosition=${scrollPosition}, clientHeight=${element.clientHeight}, scrollHeight=${scrollHeight}, isNearEnd=${isNearEnd}`);
          return isNearEnd;
        }),
        debounceTime(300)
      )
      .subscribe(() => {
        console.log(
          'setupScrollListener: Evento de rolagem disparado, carregando próxima página...'
        );
        this.currentPage++;
        this.loadUsers(this.currentPage, this.pageSize, true);
      });
  }

  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o usuário "${user.email}"? Esta ação é irreversível.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', {
          duration: 3000,
        });
        // Após a exclusão, recarrega a página atual para atualizar a lista
        // Para rolagem infinita, você pode remover o item localmente e ajustar o total
        this.loadUsers(this.currentPage, this.pageSize);
      },
      error: (err) => {
        this.snackBar.open('Erro ao excluir usuário.', 'Fechar', {
          duration: 3000,
        });
        console.error('Erro ao excluir usuário:', err);
      },
    });
  }

  addUser(): void {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(user: User): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }
}

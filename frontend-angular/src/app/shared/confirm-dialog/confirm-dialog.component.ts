import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para diretivas básicas
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog'; // Módulos para diálogo
import { MatButtonModule } from '@angular/material/button'; // Para botões

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, // Importa os módulos do Material Design para diálogo
    MatButtonModule, // Importa o módulo de botão do Material Design
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData // Dados injetados no diálogo
  ) {}

  onConfirm(): void {
    // Fecha o diálogo e retorna 'true' para indicar confirmação
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Fecha o diálogo e retorna 'false' para indicar cancelamento
    this.dialogRef.close(false);
  }
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Marca a classe como uma entidade do TypeORM
export class User {
  @PrimaryGeneratedColumn() // Coluna de ID autoincrementável
  id: number;

  @Column({ unique: true }) // Coluna para o email, deve ser único
  email: string;

  @Column() // Coluna para a senha (será um hash)
  password: string;

  @Column({ default: true }) // Exemplo: coluna para status de ativo/inativo
  isActive: boolean;
}

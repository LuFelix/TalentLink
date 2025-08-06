import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Marca a classe como uma entidade do TypeORM
export class User {
  @PrimaryGeneratedColumn() // Coluna de ID autoincrementável
  id: number;

  @Column({ unique: true }) // Coluna para o email, deve ser único
  email: string;

  @Column() // Coluna para a senha (será um hash)
  password: string;

  @Column({ default: true })
  isActive: boolean;

  //Usar JSON (mais flexível e compatível com muitos DBs)
  @Column({
    type: 'jsonb',
    array: false,
    default: () => '\'["user"]\'::jsonb',
  })
  roles: string[];

  @Column({ nullable: true }) // Permite que o campo seja nulo no banco de dados
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true }) // URL da foto de perfil
  profilePictureUrl: string;
}

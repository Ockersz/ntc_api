import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('UserRole')
export class UserRole {
  @PrimaryGeneratedColumn()
  userRoleId: number;

  @Column()
  userId: number;

  @Column()
  roleId: number;

  @JoinColumn({ name: 'roleId' })
  @OneToOne(() => Role)
  role: Role;
}

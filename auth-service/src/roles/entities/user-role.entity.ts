import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

// CREATE TABLE UserRole (
//     userRoleId INT AUTO_INCREMENT PRIMARY KEY,
//     userId INT,
//     roleId INT,
//     UNIQUE (userId, roleId)  -- Ensure a user can only have a specific role once
// );
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

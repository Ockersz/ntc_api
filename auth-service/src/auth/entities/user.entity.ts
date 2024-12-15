import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 50, name: 'firstName' })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number; // Active (1) or Inactive (0)

  @Column({
    type: 'enum',
    enum: ['bus-operator', 'admin', 'ntc-user'],
    default: 'ntc-user',
  })
  userType: string;
}

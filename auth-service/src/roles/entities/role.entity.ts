import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// CREATE TABLE Role (
//     roleId INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(50) NOT NULL,
//     status TINYINT(1) NOT NULL CHECK (status IN (0, 1))
// );

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @Column('tinyint', { name: 'status', default: 1 })
  status: number;

  @Column('tinyint', { name: 'default', default: 0 })
  default: number;

  @Column({
    type: 'text',
    name: 'access',
    transformer: {
      to: (value: string[]) => value.join(','), // Serialize to comma-separated string
      from: (value: string) => value.split(','), // Deserialize to array
    },
    default: '',
  })
  access: string[];
}

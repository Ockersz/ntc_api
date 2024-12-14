import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
      to: (value: number[] | null | undefined) =>
        Array.isArray(value) ? value.join(',') : null, // Serialize to a comma-separated string
      from: (value: string | null | undefined) =>
        value ? value.split(',').map(Number) : [], // Deserialize to an array
    },
    default: null, // This can remain as null for the database
  })
  access: number[];
}

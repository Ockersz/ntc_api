import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RoleAccess')
export class RoleAccess {
  @PrimaryGeneratedColumn()
  accessId: number;

  @Column('varchar', { name: 'resource', length: 100 })
  resource: string;

  // Use transformers to convert between string[] and TEXT
  @Column({
    type: 'text',
    transformer: {
      to: (value: string[]) => value.join(','), // Serialize to comma-separated string
      from: (value: string) => value.split(','), // Deserialize to array
    },
  })
  accessType: string[];
}

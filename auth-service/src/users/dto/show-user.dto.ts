import { Role } from 'src/roles/entities/role.entity';

export class ShowUserDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: number;
  roles: Role[];
}

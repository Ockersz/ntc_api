import * as bcryp from 'bcrypt';

export class Common {
  static async hashPassword(password: string): Promise<string> {
    return bcryp.hash(password, await bcryp.genSalt());
  }

  static async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcryp.compare(password, hash);
  }
}

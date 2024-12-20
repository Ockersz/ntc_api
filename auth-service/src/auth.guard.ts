import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token missing or invalid');
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Attach user info to the request for later use
      request.user = payload;
      if (request.route.path === '/auth/change-password') {
        return true;
      }

      const resource = this.getResourceFromPath(request.route.path);
      const accessType = this.getAccessType(request.method);

      if (!resource || !accessType) {
        throw new ForbiddenException('Resource or access type not defined');
      }

      const userPermissions = payload.permissions || {};

      if (!this.hasPermissions(userPermissions[resource], accessType)) {
        throw new ForbiddenException(
          `You do not have the required permissions to ${accessType} ${resource}`,
        );
      }

      return true;
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Invalid or expired access token');
      }
      throw error;
    }
  }

  private getResourceFromPath(path: string): string | null {
    const segments = path.split('/').filter(Boolean); // Remove empty segments
    return segments.length > 0 ? segments[0] : null;
  }

  private getAccessType(method: string): string | null {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'read';
      case 'POST':
        return 'write';
      case 'PUT':
        return 'update';
      case 'DELETE':
        return 'delete';
      default:
        return null;
    }
  }

  private hasPermissions(
    userPermissions: string[] | undefined,
    requiredPermission: string,
  ): boolean {
    if (!userPermissions) {
      return false;
    }
    return userPermissions.includes(requiredPermission);
  }
}

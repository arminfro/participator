import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class WebsocketJwtAuthGuard
  extends AuthGuard('websocket-jwt')
  implements CanActivate {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = await context.switchToWs().getClient();
    const token = socket.handshake.headers.authorization;
    const verifiedUser = this.authService.verify(token);
    socket.client.request.user = verifiedUser;

    return Boolean(verifiedUser);
  }

  // handleRequest(err, user, info, context, status) {
  //   console.log(err, user, info, status);
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}

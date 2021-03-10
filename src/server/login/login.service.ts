import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { urlWithProtocol } from '../../constants';
import { UserCreate } from '../../types/user';
import { AuthService } from '../auth/auth.service';
import PasswordRecover from '../login/password-recover.entity';
import { MailerService } from '../mailer/mailer.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(PasswordRecover)
    private readonly passwordRecoverRepository: Repository<PasswordRecover>,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async recoverPassword(email: string): Promise<void> {
    const user = await this.userService.findByEMail(email, {
      relations: ['passwordRecovers'],
    });

    if (
      user &&
      user.passwordRecovers.every(
        (passwordRecover) => !passwordRecover.isValid(),
      )
    ) {
      const passwordRecover = await this.buildAndSavePasswordRecover(user);
      this.mailerService.resetPassword({
        url: `${urlWithProtocol}/login/password/reset/${passwordRecover.id}`,
        email: user.email,
      });
    } else {
      throw new HttpException(
        'Recover password routine not available. Either E-Mail wrong or you may have already a valid request, check your Inbox.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resetPassword(
    userCreate: UserCreate & { passwordResetId: string },
  ): Promise<User | void> {
    const user = await this.findByPasswordRecoverId(
      userCreate.passwordResetId,
      true,
    );
    if (user && user.email === userCreate.email) {
      user.password = AuthService.hashPassword(userCreate.pws.pw1);
      await user.save();
      return user;
    }
  }

  async findByPasswordRecoverId(
    id: string,
    setToUsed = false,
  ): Promise<void | User> {
    const passwordRecover = await this.passwordRecoverRepository.findOne(id, {
      relations: ['user'],
    });
    if (passwordRecover && passwordRecover.isValid()) {
      if (setToUsed) {
        passwordRecover.isUsed = true;
        passwordRecover.save();
      }
      return passwordRecover.user;
    }
  }

  findOneUser(id: number): User | PromiseLike<User> {
    return this.userService.findOne(id);
  }

  private async buildAndSavePasswordRecover(
    user: User,
  ): Promise<PasswordRecover> {
    const passwordRecover = new PasswordRecover();
    passwordRecover.user = user;
    await passwordRecover.save();
    return passwordRecover;
  }
}

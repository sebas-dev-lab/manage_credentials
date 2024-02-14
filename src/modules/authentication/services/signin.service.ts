import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from '../dto/signin.dto';
import { SigninUseCase } from '../usesCases/signin.usecase';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import CommonResponse, {
  ResponseService,
} from 'src/common/utils/set_response.utils';
import { loginDataType } from '../types/login_data.types';
import { SigninValidationDTO } from '../dto/signin-validation.dto';
import TwoFactorUseCase from '../usesCases/two_factor.usecase';

@Injectable()
export class SigninAuthenticationService extends CommonResponse {
  constructor(
    private readonly _signinUseCase: SigninUseCase,
    private readonly _twoFactorUseCase: TwoFactorUseCase,
  ) {
    super();
  }

  async signin(
    data: SigninDto,
    login_data: loginDataType,
  ): Promise<ResponseService> {
    const user: Partial<AuthUsers> = await this._signinUseCase.controlUser(
      data.email,
    );
    await this._signinUseCase.controlPassword(
      data.password,
      user.credential.password,
    );

    const permissions = await this._signinUseCase.encryptDataToBeSent(user);

    const accessToken = await this._signinUseCase.generateToken(
      user,
      login_data,
    );

    const two_factor = await this._signinUseCase.checkTwoFactorAndSendEmail(
      user,
    );

    this.setSuccess(
      201,
      two_factor
        ? 'Successfully Signed and waiting for Two Factor Code'
        : 'Successfully Signed',
      {
        two_factor,
        access: accessToken,
        permissions,
      },
    );
    return this.setSend();
  }

  async signinValidation(
    data: SigninValidationDTO,
    user_id: number,
  ): Promise<ResponseService> {
    const validate = await this._twoFactorUseCase.verifyCode(
      user_id,
      data.code,
    );
    if (!validate) {
      throw new UnauthorizedException('Invalid Code');
    }
    this._twoFactorUseCase.updateTwoFactorAuthorizedToOk(user_id);
    this.setSuccess(201, 'Successfully Signed');
    return this.setSend();
  }
}

import { Injectable } from '@nestjs/common';
import { SigninDto } from '../dto/signin.dto';
import { SigninUseCase } from '../usesCases/signin.usecase';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import CommonResponse, {
  ResponseService,
} from 'src/common/utils/set_response.utils';
import { loginDataType } from '../types/login_data.types';

@Injectable()
export class SigninAuthenticationService extends CommonResponse {
  constructor(private readonly _signinUseCase: SigninUseCase) {
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

    this.setSuccess(200, 'Successfully Signed', {
      access: accessToken,
      permissions,
    });
    return this.setSend();
  }
}

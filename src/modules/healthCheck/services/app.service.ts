import { Injectable } from '@nestjs/common';
import CommonResponse, {
  ResponseService,
} from 'src/common/utils/set_response.utils';
import * as version from 'src/infrastructure/configurations/server/apiVersion.json';

@Injectable()
export class AppService extends CommonResponse {
  constructor() {
    super();
    this.getVersionService = this.getVersionService.bind(this);
  }

  /* Version */
  async getVersionService(): Promise<ResponseService> {
    try {
      this.setSuccess(200, 'Version API', version);
    } catch (e: any) {
      this.throwExcept();
    }
    return this.setSend();
  }
}

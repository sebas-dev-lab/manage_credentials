import { Injectable } from '@nestjs/common';
import { genericSearchType } from 'src/common/types/pagination.types';
import CommonResponse, {
    ResponseService,
} from 'src/common/utils/set_response.utils';
import { AuthUsers } from 'src/core/domain/creds_manager.entities/auth_users.entity';
import * as version from 'src/infrastructure/configurations/server/apiVersion.json';

@Injectable()
export class ManageUserServices extends CommonResponse {
    constructor() {
        super();
    }

    async findUsers(search: genericSearchType<Partial<AuthUsers>>): Promise<ResponseService> {
        const page = search?.page ? search?.page : 1;
        const limit = search?.limit ? search?.limit : 50;
        const order_by = search?.order_by ? search?.order_by.split(';').map((or) => or.split(':')) : null
        const term = search?.term;

        

        try {
            this.setSuccess(200, 'Version API', version);
        } catch (e: any) {
            this.throwExcept();
        }
        return this.setSend();
    }
}

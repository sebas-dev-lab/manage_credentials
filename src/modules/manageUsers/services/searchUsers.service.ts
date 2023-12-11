import { Injectable } from '@nestjs/common';
import { setMetadataPagination } from 'src/common/utils/setMetadataPagination.utils';
import CommonResponse, {
    ResponseService,
} from 'src/common/utils/set_response.utils';
import { AuthUserRepository } from 'src/core/repositories/auth_users.repository';
import { SearchUsersWithPaginationDto } from '../dto/searchUsers.dto';
import BuildSearchQuery from 'src/common/helpers/buildSearchQuery.helpers';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';
import { MU_AUTH_USERS } from '../constants/tableName.constants';

@Injectable()
export class SearchUsersServices extends CommonResponse {
    private readonly table_name = MU_AUTH_USERS;
    private readonly search_fields = ['name', 'last_name', 'email'];

    constructor(
        private readonly _authUsersRepository: AuthUserRepository,
    ) {
        super();
    }

    async findUsers(search: Partial<SearchUsersWithPaginationDto>): Promise<ResponseService> {
        // ==== Build Filters ==== //
        const filters = {
            ...(search.name && {
                name: search.name
            }),
            ...(search.email && {
                email: search.email
            }),
            ...(search.last_name && {
                last_name: search.last_name
            }),
        }

        try {
        // ==== Build Query to search and construct metadata ==== //
        const buildQuery = new BuildSearchQuery(
            this.table_name,
            search,
            filters,
            this.search_fields,
        )
        buildQuery.setFilters()
        buildQuery.setTerm()
        buildQuery.build()

        const { selectQuery, countQuery } = buildQuery.getQuery();
        const configPage = buildQuery.getConfigPage();
        
        // ==== Search Data ==== //
        const users = await this._authUsersRepository.query(selectQuery);
        const total = await this._authUsersRepository.query(countQuery);

        // ==== Build Response data and return ==== //
        this.setSuccess(200, 'Successfully', setMetadataPagination(total && total.length ? Number(total[0].count) : 0, configPage.limit, configPage.page, users));
        
        } catch (e) {
            Logger.error(e.stack)
            this.throwExcept()
        }
        return this.setSend();
    }
}

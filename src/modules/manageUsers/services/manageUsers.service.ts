import { Injectable } from "@nestjs/common";
import CommonResponse, { ResponseService } from "src/common/utils/set_response.utils";
import { RegisterUsersDto } from "../dto/registerUsers.dto";
import { AddUserUseCase } from "../usesCases/addUser.usecase";

@Injectable()
export class ManageUserServices extends CommonResponse {
    constructor(
        private readonly _addUserUseCase: AddUserUseCase,
    ) {
        super();
    }

    async registerUser(data: RegisterUsersDto): Promise<ResponseService> {
        this._addUserUseCase.controlEmailRegex(data.email);
        this._addUserUseCase.controlPassword(data.password);
        await this._addUserUseCase.controlRole(data.role_id);
        await this._addUserUseCase.controlEmailExists(data.email);
        await this._addUserUseCase.addUser(data);
        
        this.setSuccess(200, 'User Successfully Added')
        return this.setSend();
    }
}
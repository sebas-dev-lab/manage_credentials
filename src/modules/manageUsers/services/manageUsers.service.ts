import { Injectable } from "@nestjs/common";
import CommonResponse, { ResponseService } from "src/common/utils/set_response.utils";
import { RegisterUsersDto } from "../dto/registerUsers.dto";
import { AddUserUseCase } from "../usesCases/addUser.usecase";
import { UpdateUsersDto } from "../dto/updateUsers.dto";
import { UpdateUsersUseCase } from "../usesCases/updatesUser.usecase";

@Injectable()
export class ManageUserServices extends CommonResponse {
    constructor(
        private readonly _addUserUseCase: AddUserUseCase,
        private readonly _updateUserUseCase: UpdateUsersUseCase,
    ) {
        super();
    }

    async registerUser(data: RegisterUsersDto): Promise<ResponseService> {
        
        this._addUserUseCase.controlEmailRegex(data.email);
        this._addUserUseCase.controlPasswordRegex(data.password);
        await this._addUserUseCase.controlRoleExists(data.role_id);
        await this._addUserUseCase.controlEmailExists(data.email);
        await this._addUserUseCase.addUser(data);
        
        this.setSuccess(200, 'User Successfully Added')
        return this.setSend();
    }

    async updateUser(user_id: number, data: UpdateUsersDto): Promise<ResponseService> { 

        await this._updateUserUseCase.controlUser(user_id);
        if (data.role_id) await this._updateUserUseCase.controlRoleExists(data.role_id);
        if (data.email) await this._updateUserUseCase.controlEmailExists(data.email);
        await this._updateUserUseCase.updateUser(user_id, data);

        this.setSuccess(200, 'User Successfully Updated')
        return this.setSend();
    }
}
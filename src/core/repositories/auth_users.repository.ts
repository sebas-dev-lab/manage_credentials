import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./generic.repositories";
import { AuthUsers } from "../domain/creds_manager.entities/auth_users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthUserRepository extends BaseRepository<AuthUsers> {
    constructor(
        @InjectRepository(AuthUsers)
        repository: Repository<AuthUsers>
    ) {
        super(repository);
    }
}
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./generic.repositories";
import { AuthCredentials } from "../domain/creds_manager.entities/auth_credentials.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthCredentialsRepository extends BaseRepository<AuthCredentials> {
    constructor(
        @InjectRepository(AuthCredentials)
        repository: Repository<AuthCredentials>
    ) {
        super(repository);
    }
}
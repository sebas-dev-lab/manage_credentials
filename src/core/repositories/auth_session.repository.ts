import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./generic.repositories";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthSessions } from "../domain/creds_manager.entities/auth_sessions.entity";

@Injectable()
export class AuthSessionReposiroty extends BaseRepository<AuthSessions> {
    constructor(
        @InjectRepository(AuthSessions)
        repository: Repository<AuthSessions>
    ) {
        super(repository);
    }
}
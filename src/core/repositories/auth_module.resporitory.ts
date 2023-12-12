import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./generic.repositories";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthModules } from "../domain/creds_manager.entities/auth_modules.entity";

@Injectable()
export class ModuleRepository extends BaseRepository<AuthModules> {
    constructor(
        @InjectRepository(AuthModules)
        repository: Repository<AuthModules>
    ) {
        super(repository);
    }
}
// Libs
import { INestApplication } from "@nestjs/common";

// Build
import DocsAbstract from "src/docs/build/docs-abstract";

// Cnts
import { MANAGE_USERS_MODULE_DESCRIPTION, MANAGE_USERS_MODULE_PATH, MANAGE_USERS_MODULE_TITLE, MANAGE_USERS_MODULE_VERSION } from "./constants";

export default class ManageUsersDocs extends DocsAbstract {
    static build(app: INestApplication, module: Function) {
        const authDocs = new ManageUsersDocs(app, module);
        authDocs.setTitle(MANAGE_USERS_MODULE_TITLE)
            .setDescription(MANAGE_USERS_MODULE_DESCRIPTION)
            .setEndpointVersion(MANAGE_USERS_MODULE_VERSION)
            .setPath(MANAGE_USERS_MODULE_PATH)
            .setOptions()
            .build();
    }
}
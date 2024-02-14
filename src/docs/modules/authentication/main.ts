// Libs
import { INestApplication } from "@nestjs/common";

// Build
import DocsAbstract from "src/docs/build/docs-abstract";

// Cnts
import { AUTH_MODULE_DESCRIPTION, AUTH_MODULE_PATH, AUTH_MODULE_TITLE, AUTH_MODULE_VERSION } from "./constants";

export default class AuthMainDocs extends DocsAbstract {
    static build(app: INestApplication, module: Function) {
        const authDocs = new AuthMainDocs(app, module);
        authDocs.setTitle(AUTH_MODULE_TITLE)
        .setDescription(AUTH_MODULE_DESCRIPTION)
        .setEndpointVersion(AUTH_MODULE_VERSION)
        .setPath(AUTH_MODULE_PATH)
        .setOptions()
        .build();
    }
}
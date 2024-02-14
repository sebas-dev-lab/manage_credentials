// Libs
import { INestApplication } from "@nestjs/common";

// Build
import DocsAbstract from "src/docs/build/docs-abstract";

// Cnts
import { MANAGER_SITE_CREDS_MODULE_DESCRIPTION, MANAGER_SITE_CREDS_MODULE_PATH, MANAGER_SITE_CREDS_MODULE_TITLE, MANAGER_SITE_CREDS_MODULE_VERSION } from "./constants";

export default class ManagerSiteCredentialsDocs extends DocsAbstract {
    static build(app: INestApplication, module: Function) {
        const authDocs = new ManagerSiteCredentialsDocs(app, module);
        authDocs.setTitle(MANAGER_SITE_CREDS_MODULE_TITLE)
            .setDescription(MANAGER_SITE_CREDS_MODULE_DESCRIPTION)
            .setEndpointVersion(MANAGER_SITE_CREDS_MODULE_VERSION)
            .setPath(MANAGER_SITE_CREDS_MODULE_PATH)
            .setOptions()
            .build();
    }
}
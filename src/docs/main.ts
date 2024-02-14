// Libs
import { INestApplication } from "@nestjs/common";

// Mods
import AuthMainDocs from "./modules/authentication/main";
import ManageUsersDocs from "./modules/manageUsers/main";
import ManagerSiteCredentialsDocs from "./modules/managerSiteCredentials/main";

// Cnts
import { ManageSiteCredentials } from "src/modules/manageSiteCredentials/manageSiteCredentials.module";
import { AuthenticationModule } from "src/modules/authentication/authentication.module";
import { ManageUsersModule } from "src/modules/manageUsers/manageUsers.module";

export default function setEndpointsDocs(app: INestApplication): void {
    AuthMainDocs.build(app, AuthenticationModule);
    ManagerSiteCredentialsDocs.build(app, ManageSiteCredentials);
    ManageUsersDocs.build(app, ManageUsersModule);
}
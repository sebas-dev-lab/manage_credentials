export interface PermissionData {
  permission_id: number;
  role_id: number;
  module_id: number;
  module_description: string;
  module_endpoint: string;
}

export interface userAuthContext {
  user_id: number;
  user_email: string;
  role_id: number;
}

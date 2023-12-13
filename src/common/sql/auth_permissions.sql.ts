export const findModulesPermissions = (
  role_id: number,
  endpoint: string,
): string =>
  `
    select
        ap.id as permission_id,
        ap.auth_role_id as role_id,
        am.id as module_id,
        am.description as module_description,
        am.endpoint as module_endpoint
    from auth_permissions ap
    left join auth_modules am on am.id = ap.auth_module_id
    where ap.auth_role_id = ${role_id}
    and am.endpoint = '${endpoint}';
    `;

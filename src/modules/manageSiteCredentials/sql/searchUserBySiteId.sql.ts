export const findUserBySiteId = (siteId: number): string =>
  `
    select 
        au.id as user_id,
        au.email as user_email,
        au."name"  as user_name,
        au.last_name as user_last_name,
        au.auth_role_id as role_id,
        ar.description as role_description,
        au.enable as user_active
    from users_site_credentials usc
    left join auth_users au on au.id = usc."authUsersId"
    left join auth_roles ar on ar.id = au.auth_role_id
    where usc."siteCredentialsId" = ${siteId};
  `;

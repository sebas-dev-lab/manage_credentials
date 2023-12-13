export const findAuthUserById = (userId = 1): string =>
  `
    select *
    from auth_users au
    where au.id = ${userId};
    `;

export const countAuthUsers = (): string =>
  `
    select count(*)
    from auth_users

    `;

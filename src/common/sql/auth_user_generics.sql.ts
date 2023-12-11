import { AuthUsers } from "src/core/domain/creds_manager.entities/auth_users.entity"

export const findAuthUserById = (userId: number = 1): string =>
  `
    select *
    from auth_users au
    where au.id = ${userId};
    `

export const countAuthUsers = (): string =>
  `
    select count(*)
    from auth_users

    `

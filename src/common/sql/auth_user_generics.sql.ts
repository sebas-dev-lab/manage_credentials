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

export const searchAuthUsers = (term = null, pageOptions: string, order_by = [['id', 'asc']], filters?: Partial<AuthUsers>): string =>
    `
    select *
    from auth_users
    where
      ${term ? 'column_name = $1' : '1 = 1'}
    order by
      ${order_by.map(([field, order]) => `${field} ${order}`).join(', ')}
      ${pageOptions}
      ;
    `

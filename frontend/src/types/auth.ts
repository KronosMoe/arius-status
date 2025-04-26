import { IUser } from './user'

export type AuthUser = Pick<IUser, 'username' | 'image'>

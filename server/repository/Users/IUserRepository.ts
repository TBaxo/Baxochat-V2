import { User } from "../../../shared/Models/User/User";


export interface IUserRepository {
    readUserByUsername(username: string): Promise<User>;
    readAllUsernames(): Promise<string[]>;
    readIsUsernameInUse(username: string): Promise<boolean>;
    readActiveUsers(): Promise<User[]>;
}
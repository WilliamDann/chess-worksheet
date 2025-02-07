import { hash, genSalt, compare } from "bcrypt"

export enum AccountType
{
    Student = 'Student',
    Coach   = 'Coach'
}

export default interface User
{
    id              : number,
    name            : string,
    email           : string,
    passwordHash    : string,
    accountType     : AccountType
}

export async function hashPassword(password: string)
{
    return await hash(password, await genSalt(10));
}

export async function checkPassword(plainText: string, hashed: string)
{
    return await compare(plainText, hashed);
}
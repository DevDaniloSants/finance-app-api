import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {
    PostgresCreateUserRepository,
    PostgresGetByUserEmailRepository,
} from '../repositories/postgres/index.js';

import { EmailIsAlreadyInUseError } from '../errors/user.js';

export class CreateUserUseCase {
    async execute(createUserParams) {
        const postgresGetByUserEmailRepository =
            new PostgresGetByUserEmailRepository();

        const userWithProvidedEmail =
            await postgresGetByUserEmailRepository.execute(
                createUserParams.email,
            );

        if (userWithProvidedEmail) {
            throw new EmailIsAlreadyInUseError(createUserParams.email);
        }

        // criptografar senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

        // criar id do usuário
        const userId = uuidv4();

        // inserir o usuário no banco

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        // chamar o repository

        const postgresCreateUserRepository = new PostgresCreateUserRepository();

        const createdUser = await postgresCreateUserRepository.execute(user);

        return createdUser;
    }
}

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';
import { PostgresGetByUserEmail } from '../repositories/postgres/get-user-by-email.js';

export class CreateUserUseCase {
    async execute(createUserParams) {
        // TODO: verificar se o e-mail já está em uso
        const postgresGetByUserEmail = new PostgresGetByUserEmail();

        const userWithProvidedEmail = postgresGetByUserEmail.execute(
            createUserParams.email,
        );

        if (userWithProvidedEmail) {
            throw new Error('The provided e-mail is already in use');
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

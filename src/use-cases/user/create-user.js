import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { EmailIsAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
    constructor(getUserByEmailRepository, createUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.createUserRepository = createUserRepository;
    }
    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email);

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

        const createdUser = await this.createUserRepository.execute(user);

        return createdUser;
    }
}

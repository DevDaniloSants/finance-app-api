import bcrypt from 'bcrypt';

import { EmailIsAlreadyInUseError } from '../errors/user.js';
import {
    PostgresGetByUserEmailRepository,
    PostgresUpdateUserRepository,
} from '../repositories/postgres/index.js';

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetByUserEmailRepository =
                new PostgresGetByUserEmailRepository();

            const userWithProvidedEmail =
                await postgresGetByUserEmailRepository.execute(
                    updateUserParams.email,
                );

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailIsAlreadyInUseError(updateUserParams.email);
            }
        }

        const user = { ...updateUserParams };

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            );

            user.password = hashedPassword;
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository();

        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        );

        return updatedUser;
    }
}

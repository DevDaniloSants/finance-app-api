import { prisma } from '../../../../prisma/prisma.js';

export class CreateUserRepository {
    async execute(createUserParams) {
        return await prisma.user.create({
            data: {
                id: createUserParams.id,
                first_name: createUserParams.first_name,
                last_name: createUserParams.last_name,
                email: createUserParams.email,
                password: createUserParams.password,
            },
        });
    }
}

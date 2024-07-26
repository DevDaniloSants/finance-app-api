import { prisma } from '../../../../prisma/prisma.js';

export class UpdateUserRepository {
    async execute(userId, updateUserParams) {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateUserParams,
        });
    }
}

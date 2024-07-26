import { prisma } from '../../../../prisma/prisma.js';

export class DeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/user.js';

export class DeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(userId);
                }
            }
            throw error;
        }
    }
}

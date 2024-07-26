import { prisma } from '../../../../prisma/prisma.js';

export class GetUserByEmailRepository {
    async execute(email) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
}

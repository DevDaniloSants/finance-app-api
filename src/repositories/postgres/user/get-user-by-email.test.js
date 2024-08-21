import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser } from '../../../tests';
import { GetUserByEmailRepository } from './get-user-by-email';

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        const user = await prisma.user.create({ data: fakerUser });

        const sut = new GetUserByEmailRepository();

        const result = await sut.execute(user.email);

        expect(result).toStrictEqual(user);
    });

    it('should call Prisma with correct params', async () => {
        const sut = new GetUserByEmailRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

        await sut.execute(fakerUser.email);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { email: fakerUser.email },
        });
    });
});

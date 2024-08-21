import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser } from '../../../tests';
import { GetUserByIdRepository } from './get-user-by-id';

describe('GetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        const user = await prisma.user.create({ data: fakerUser });
        const sut = new GetUserByIdRepository();

        const result = await sut.execute(user.id);

        expect(result).toStrictEqual(user);
    });

    it('should call Prisma with correct params', async () => {
        const sut = new GetUserByIdRepository();
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

        await sut.execute(fakerUser.id);

        expect(prismaSpy).toHaveBeenCalledWith({ where: { id: fakerUser.id } });
    });
});

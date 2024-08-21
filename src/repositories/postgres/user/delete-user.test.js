import { prisma } from '../../../../prisma/prisma';
import { user } from '../../../tests';
import { DeleteUserRepository } from './delete-user';

describe('DeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        //arrange
        await prisma.user.create({
            data: user,
        });

        const sut = new DeleteUserRepository();

        //act
        const result = await sut.execute(user.id);

        //assert
        expect(result).toStrictEqual(user);
    });

    it('should  call Prisma with correct params', async () => {
        //arrage
        const sut = new DeleteUserRepository();
        const prismaSpy = jest.spyOn(prisma.user, 'delete');

        //act
        await sut.execute(user.id);

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        });
    });
});

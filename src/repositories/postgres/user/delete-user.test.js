import { prisma } from '../../../../prisma/prisma';
import { user } from '../../../tests';
import { DeleteUserRepository } from './delete-user';

describe('DeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        //arrage
        await prisma.user.create({
            data: user,
        });

        const sut = new DeleteUserRepository();

        //act
        const result = await sut.execute(user.id);

        //assert
        expect(result).toStrictEqual(user);
    });
});

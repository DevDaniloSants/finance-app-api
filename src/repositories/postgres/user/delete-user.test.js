import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../../../prisma/prisma';
import { user } from '../../../tests';
import { DeleteUserRepository } from './delete-user';
import { UserNotFoundError } from '../../../errors/user';

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

    it('should call Prisma with correct params', async () => {
        //arrage
        await prisma.user.create({
            data: user,
        });
        const sut = new DeleteUserRepository();
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'delete');

        //act
        await sut.execute(user.id);

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        });
    });

    it('should throws generic error if Prisma throws generic error', async () => {
        //arrage
        await prisma.user.create({
            data: user,
        });
        const sut = new DeleteUserRepository();
        import.meta.jest
            .spyOn(prisma.user, 'delete')
            .mockRejectedValueOnce(new Error());

        //act
        const promise = sut.execute(user.id);

        //assert
        await expect(promise).rejects.toThrow();
    });

    it('should throws if UserNotFoundError is not found', async () => {
        //arrange
        await prisma.user.create({
            data: user,
        });

        const sut = new DeleteUserRepository();

        import.meta.jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        );

        //act
        const promise = sut.execute(user.id);

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
    });
});

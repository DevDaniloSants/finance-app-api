import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { UpdateUserRepository } from './update-user';
import { user as fakerUser } from '../../../tests';
import { UserNotFoundError } from '../../../errors/user';

describe('UpdateUserRepository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
    };

    it('should update user on db', async () => {
        const user = await prisma.user.create({ data: fakerUser });
        const sut = new UpdateUserRepository();

        const result = await sut.execute(user.id, updateUserParams);

        expect(result).toStrictEqual(updateUserParams);
    });

    it('should call Prisma with correct params', async () => {
        const user = await prisma.user.create({ data: fakerUser });
        const sut = new UpdateUserRepository();
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'update');

        await sut.execute(user.id, updateUserParams);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        });
    });

    it('should throw if Prisma throws', async () => {
        const user = await prisma.user.create({ data: fakerUser });
        const sut = new UpdateUserRepository();

        import.meta.jest
            .spyOn(prisma.user, 'update')
            .mockRejectedValueOnce(new Error());

        const promise = sut.execute(user.id, updateUserParams);

        await expect(promise).rejects.toThrow();
    });

    it('should throws if UserNotFoundError is not found', async () => {
        const sut = new UpdateUserRepository();

        import.meta.jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        );

        //act
        const promise = sut.execute(updateUserParams.id);

        //assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(updateUserParams.id),
        );
    });
});

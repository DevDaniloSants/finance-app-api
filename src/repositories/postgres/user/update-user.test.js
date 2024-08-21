import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser } from '../../../tests';
import { UpdateUserRepository } from './update-user';

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
        const prismaSpy = jest.spyOn(prisma.user, 'update');

        await sut.execute(user.id, updateUserParams);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        });
    });
});

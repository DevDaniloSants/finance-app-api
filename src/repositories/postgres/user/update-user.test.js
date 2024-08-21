import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser } from '../../../tests';
import { UpdateUserRepository } from './update-user';

describe('UpdateUserRepository', () => {
    it('should update user on db', async () => {
        const user = await prisma.user.create({ data: fakerUser });
        const sut = new UpdateUserRepository();

        const updateUserParams = {
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 6 }),
        };

        const result = await sut.execute(user.id, updateUserParams);

        expect(result).toStrictEqual(updateUserParams);
    });
});

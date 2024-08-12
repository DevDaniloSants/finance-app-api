import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from './delete-user';

describe('DeleteUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
    };

    class DeleteUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub();
        const sut = new DeleteUserUseCase(deleteUserRepository);

        return { sut, deleteUserRepository };
    };

    const userId = faker.string.uuid();

    it('should successfully delete a user', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const deleteUser = await sut.execute(userId);

        //assert
        expect(deleteUser).toEqual(user);
    });
});

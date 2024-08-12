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
    it('should call DeleteUserRepository with correct params', async () => {
        //arrange
        const { sut, deleteUserRepository } = makeSut();

        const executeSpy = jest.spyOn(deleteUserRepository, 'execute');
        //act

        await sut.execute(userId);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw if DeleteUserRepository throws', async () => {
        // arrange
        const { sut, deleteUserRepository } = makeSut();

        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // act
        const promise = sut.execute(userId);

        // assert
        await expect(promise).rejects.toThrow();
    });
});

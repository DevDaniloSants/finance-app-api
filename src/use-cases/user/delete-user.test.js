import { user } from '../../tests/fixtures/user';
import { DeleteUserUseCase } from './delete-user';

describe('DeleteUserUseCase', () => {
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

    it('should successfully delete a user', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const deleteUser = await sut.execute(user.id);

        //assert
        expect(deleteUser).toEqual(user);
    });
    it('should call DeleteUserRepository with correct params', async () => {
        //arrange
        const { sut, deleteUserRepository } = makeSut();

        const executeSpy = jest.spyOn(deleteUserRepository, 'execute');
        //act

        await sut.execute(user.id);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(user.id);
    });

    it('should throw if DeleteUserRepository throws', async () => {
        // arrange
        const { sut, deleteUserRepository } = makeSut();

        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // act
        const promise = sut.execute(user.id);

        // assert
        await expect(promise).rejects.toThrow();
    });
});

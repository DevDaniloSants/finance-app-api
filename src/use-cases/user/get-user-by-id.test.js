import { user } from '../../tests/fixtures/user';
import { GetUserByIdUseCase } from './get-user-by-id';
describe('GetUserByIdUseCase', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetUserByIdUseCase(getUserByIdRepository);

        return { sut, getUserByIdRepository };
    };

    it('should get user by id successfully ', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(user.id);

        //assert
        expect(result).toEqual(user);
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');

        //act
        await sut.execute(user.id);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(user.id);
    });
    it('should throw  if GetByUserIdRepository throws', async () => {
        // arrage
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );
        // act

        const promise = sut.execute(user.id);

        // assert
        await expect(promise).rejects.toThrow();
    });
});

import { GetTransactionsByUserIdUseCase } from './get-transactions-by-userId';
import { UserNotFoundError } from '../../errors/user';
import { transaction, user } from '../../tests';
describe('GetTransactionsByUserId', () => {
    class GetTransactionsByUserRepositoryStub {
        async execute() {
            return transaction;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getTransactionsByUserRepository =
            new GetTransactionsByUserRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();

        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserRepository,
            getUserByIdRepository,
        );

        return { sut, getTransactionsByUserRepository, getUserByIdRepository };
    };

    it('should get transactions by userId successfully', async () => {
        //arrage
        const { sut } = makeSut();

        //act
        const result = await sut.execute(user.id);

        //assert
        expect(result).toEqual(transaction);
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrage
        const { sut, getUserByIdRepository } = makeSut();

        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        );
        //act
        await sut.execute(user.id);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(user.id);
    });
    it('should call GetTransactionsByUserRepository with correct params', async () => {
        //arrage
        const { sut, getTransactionsByUserRepository } = makeSut();

        const executeSpy = import.meta.jest.spyOn(
            getTransactionsByUserRepository,
            'execute',
        );
        //act
        await sut.execute(user.id);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(user.id);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null);

        //act
        const promise = sut.execute(user.id);

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
    });

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrage
        const { sut, getUserByIdRepository } = makeSut();

        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error());

        //act
        const promise = sut.execute(user.id);

        //assert
        await expect(promise).rejects.toThrow();
    });

    it('should throw if GetTransactionsByUserRepository throws', async () => {
        //arrage
        const { sut, getTransactionsByUserRepository } = makeSut();

        import.meta.jest
            .spyOn(getTransactionsByUserRepository, 'execute')
            .mockRejectedValueOnce(new Error());

        //act
        const promise = sut.execute(user.id);

        //assert
        await expect(promise).rejects.toThrow();
    });
});

import { CreateTransactionUseCase } from './create-transaction';
import { UserNotFoundError } from '../../errors/user';

import { transaction, user } from '../../tests/index.js';
describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
        id: undefined,
    };

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    class IdGerenatorAdapterStub {
        async execute() {
            return 'random_id';
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const idGeretatorAdapter = new IdGerenatorAdapterStub();

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeretatorAdapter,
        );

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeretatorAdapter,
        };
    };

    it('should create transaction successfully ', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            ...createTransactionParams,
            id: 'random_id',
        });

        //assert
        expect(result).toEqual({
            ...createTransactionParams,
            id: 'random_id',
        });
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrage
        const { sut, getUserByIdRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
        //act
        await sut.execute({ ...createTransactionParams, id: 'random_id' });

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        );
    });
    it('should call IdGeneratorAdapter', async () => {
        //arrage
        const { sut, idGeretatorAdapter } = makeSut();

        const executeSpy = jest.spyOn(idGeretatorAdapter, 'execute');
        //act
        await sut.execute({ ...createTransactionParams, id: 'random_id' });

        //assert
        expect(executeSpy).toHaveBeenCalled();
    });

    it('should call CreateTransactionRepository with correct params ', async () => {
        //arrange
        const { sut, createTransactionRepository } = makeSut();
        const executeSpy = jest.spyOn(createTransactionRepository, 'execute');

        //act
        await sut.execute({ ...createTransactionParams, id: 'random_id' });

        //assert
        expect(executeSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        });
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        );
    });

    it('should throw if CreateTransactionRepository throws', async () => {
        //arrange
        const { sut, createTransactionRepository } = makeSut();

        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });
    it('should throw if IdGeneratorAdapter throws', async () => {
        //arrange
        const { sut, idGeretatorAdapter } = makeSut();

        jest.spyOn(idGeretatorAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });
});

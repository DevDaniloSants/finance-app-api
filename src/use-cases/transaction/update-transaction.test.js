import { UpdateTransactionUseCase } from './update-transaction';
import { transaction } from '../../tests';

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute(transactionId, params) {
            return {
                id: transactionId,
                ...params,
            };
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub();

        const sut = new UpdateTransactionUseCase(updateTransactionRepository);

        return { sut, updateTransactionRepository };
    };

    const updateTransactionParams = {
        ...transaction,
        id: undefined,
    };

    it('should update a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        );
        //assert
        expect(result).toEqual({
            id: transaction.id,
            ...updateTransactionParams,
        });
    });

    it('should call UpdateTransactionRepository with correct params', async () => {
        //arrange
        const { sut, updateTransactionRepository } = makeSut();

        const executeSpy = jest.spyOn(updateTransactionRepository, 'execute');

        //act
        await sut.execute(transaction.id, updateTransactionParams);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            transaction.id,
            updateTransactionParams,
        );
    });

    it('should throw if UpdateTransactionRepository throws', async () => {
        //arrange
        const { sut, updateTransactionRepository } = makeSut();

        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        //act
        const promise = sut.execute(transaction.id, updateTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });
});

import { faker } from '@faker-js/faker';
import { UpdateTransactionUseCase } from './update-transaction';

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
        user_id: faker.string.uuid(),
        name: faker.commerce.productName,
        date: faker.date.anytime(),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
        amount: faker.finance.amount(),
    };

    const transactionId = faker.string.uuid();

    it('should update a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(
            transactionId,
            updateTransactionParams,
        );
        //assert
        expect(result).toEqual({
            id: transactionId,
            ...updateTransactionParams,
        });
    });

    it('should call UpdateTransactionRepository with correct params', async () => {
        //arrange
        const { sut, updateTransactionRepository } = makeSut();

        const executeSpy = jest.spyOn(updateTransactionRepository, 'execute');

        //act
        await sut.execute(transactionId, updateTransactionParams);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            transactionId,
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
        const promise = sut.execute(transactionId, updateTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });
});

import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from './delete-transaction';

describe('DeleteTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName,
        date: faker.date.anytime(),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
        amount: faker.finance.amount(),
    };

    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction;
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub();
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

        return { sut, deleteTransactionRepository };
    };

    it('should successfully delete a transaction', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(transaction.id);

        //assert
        expect(result).toEqual(transaction);
    });

    it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut();

        const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute');
        // act
        await sut.execute(transaction.id);

        // assert
        expect(executeSpy).toHaveBeenCalledWith(transaction.id);
    });
});

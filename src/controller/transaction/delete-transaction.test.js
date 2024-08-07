import { de, faker } from '@faker-js/faker';
import { DeleteTransactionController } from './delete-transaction';

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                amount: +faker.finance.amount({ min: 0, max: 10000, dec: 2 }),
                type: faker.helpers.arrayElement([
                    'EARNING',
                    'EXPENSE',
                    'INVESTMENT',
                ]),
            };
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
        const sut = new DeleteTransactionController(deleteTransactionUseCase);

        return { sut, deleteTransactionUseCase };
    };

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    };

    it('should return 200 when deleting a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 when transaction id is invalid', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            params: { transactionId: 'invalid_id' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 404 when transaction is not found', async () => {
        //arrage
        const { sut, deleteTransactionUseCase } = makeSut();

        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        );
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(404);
    });
    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        //arrage
        const { sut, deleteTransactionUseCase } = makeSut();

        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });
});

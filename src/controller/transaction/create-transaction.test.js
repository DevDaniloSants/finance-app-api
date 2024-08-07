import { faker } from '@faker-js/faker';
import { CreateTransactionController } from './create-transaction';

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction;
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub();
        const sut = new CreateTransactionController(createTransactionUseCase);

        return { sut, createTransactionUseCase };
    };

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: +faker.finance.amount({ min: 0, max: 10000, dec: 2 }),
            type: 'EXPENSE',
        },
    };

    it('should return 201 when creating transaction successfully', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(201);
    });

    it('should return 400 when missing user_id ', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, user_id: undefined },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
});

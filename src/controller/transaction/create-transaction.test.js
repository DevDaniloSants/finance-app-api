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
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
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
    it('should return 400 when missing name ', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, name: undefined },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when missing date ', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, date: undefined },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when missing type ', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, type: undefined },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when missing amount ', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, amount: undefined },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when date is invalid ', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, date: 'invalid_date' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when type is not EARNING, EXPENSE or INVESTMENT', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, type: 'invalid_type' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when amount is not a valid currency', async () => {
        //arrange
        const { sut } = makeSut();
        //act

        const result = await sut.execute({
            body: { ...httpRequest.body, amount: 'invalid_amount' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when CreateTransactionUseCase throws', async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut();

        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );
        //act

        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });
});

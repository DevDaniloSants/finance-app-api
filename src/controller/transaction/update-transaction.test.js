import { faker } from '@faker-js/faker';
import { UpdateTransactionController } from './update-transaction';
import { transaction } from '../../tests';
import { TransactionNotFoundError } from '../../errors/transaction';

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return transaction;
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
        const sut = new UpdateTransactionController(updateTransactionUseCase);

        return { sut, updateTransactionUseCase };
    };

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: +faker.finance.amount({
                min: 0,
                max: 10000,
                dec: 2,
            }),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
        },
    };

    it('should return 200 when updating a transaction successfully', async () => {
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
            body: { ...httpRequest.body },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when unallowed field is provided', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({
            params: { ...httpRequest.params },
            body: { ...httpRequest.body, unallowed_field: 'unallowed_field' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when amount is invalid', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({
            params: { ...httpRequest.params },
            body: { ...httpRequest.body, amount: 'invalid_amount' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when type is invalid', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({
            params: { ...httpRequest.params },
            body: { ...httpRequest.body, type: 'invalid_type' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 500 when UpdateTransactionUseCase throws', async () => {
        //arrange
        const { sut, updateTransactionUseCase } = makeSut();

        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error());
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });

    it('should return 404 when TransactionNotFoundError is thrown', async () => {
        //arrange
        const { sut, updateTransactionUseCase } = makeSut();

        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError());
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(404);
    });

    it('should call UpdateTransactioUseCase with correct params', async () => {
        //arrange
        const { sut, updateTransactionUseCase } = makeSut();

        const executeSpy = import.meta.jest.spyOn(
            updateTransactionUseCase,
            'execute',
        );
        //act
        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        );
    });
});

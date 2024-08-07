import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from './get-transactions-by-userId';

describe('GetTransactionsByUserId', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [
                {
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
            ];
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub();
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        );

        return { sut, getTransactionsByUserIdUseCase };
    };

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    };

    it('should return 200 when finding transactions by user id successfully ', async () => {
        //arrange

        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({ query: { userId: undefined } });

        //assert
        expect(result.statusCode).toBe(400);
    });
});
